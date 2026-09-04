---
title: "Intent detection at firehose scale"
date: "2025-10-04"
excerpt: "Running a language model over a live social feed without going broke: batch the classification, keep the retrieval local, and let each component do the thing it is actually good at."
tags: ["LLM systems", "Embeddings", "Cost engineering"]
---

*Draft. The technical content is accurate; the personal narrative is still mine to write.*

At the NYC AI Agents Hackathon I built an agent that watches the public Bluesky
firehose for people saying they want to volunteer, and matches them to real
volunteering opportunities in New York City.

The interesting part is not the matching. It is the cost structure. This post is
about a pattern that comes up whenever you put a language model in front of a
high-volume stream: **do not call the model per item.**

## The naive design, and why it fails

The obvious pipeline is one call per post:

```text
post ──▶ LLM: "is this about volunteering?" ──▶ if yes, search opportunities
```

The Bluesky firehose carries on the order of a hundred posts per second. At one
call per post you are making 360,000 calls an hour, almost all of which return
"no." You are paying a language model to read pet photos.

Worse, the per-call overhead dominates. A short post is maybe 30 tokens, but every
call re-sends the system prompt, the instructions, and the output schema. The
useful payload is a rounding error on the request.

## Two ideas that fix it

### 1. Batch the classification

Collect posts for a fixed window, then classify the whole window in one call.

```javascript
// One call per 30-second window, not one call per post.
const prompt = `Analyze each post below and determine:
1. Does it express interest in volunteering? (yes/no)
2. If yes, extract a semantic search query to match volunteering opportunities.

Respond in JSON:
{"results": [{"post_index": 0,
              "has_volunteering_intent": true,
              "search_query": "...",
              "confidence": 0.0}]}

Posts to analyze:
${posts.map((p, i) => `[${i}] "${p.post.text}"`).join('\n')}`

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'Respond only with valid JSON.' },
    { role: 'user', content: prompt },
  ],
  response_format: { type: 'json_object' },
  temperature: 0.3,
})
```

A 30-second window holds 50 to 150 posts. The fixed overhead is now amortised
across all of them, and the marginal cost of one more post is just its own tokens.
Measured cost came out around **a tenth of a cent per hundred posts**.

Three details matter more than they look:

- **`response_format: json_object`** turns "please return JSON" from a request into
  a guarantee. Without it, roughly one call in twenty comes back wrapped in prose
  or a code fence, and you write a parser for the model's mood.
- **`post_index`** in the output. The model must tell you which post each verdict
  belongs to. Do not rely on it returning results in order, or returning one
  result per input.
- **Low temperature.** This is classification, not writing. There is nothing to be
  gained from sampling diversity.

The cost of batching is latency: a post waits up to 30 seconds before it is
looked at. For this application that is invisible. For a live chat reply it would
not be.

### 2. Do not use the model for retrieval

Once you know someone wants to volunteer, you still have to find them something
to do. That is a similarity search, not a reasoning problem, and it can run
entirely on your own machine.

Every opportunity is embedded once, ahead of time, into a 384-dimensional vector
using a small local model:

```javascript
import { pipeline } from '@xenova/transformers'

this.embedder = await pipeline(
  'feature-extraction',
  'Xenova/all-MiniLM-L6-v2'   // ~80 MB, runs on CPU
)

async embed(text) {
  const output = await this.embedder(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}
```

The text embedded for each opportunity is not just its title. It is a composed
document that packs in everything a person might phrase their interest around:

```javascript
const text = `${opp.title}. ${opp.organization}. ${opp.category}.
${opp.description}
Location: ${opp.location.borough}.
Schedule: ${opp.schedule.join(', ')}.
Skills: ${opp.skills_needed.join(', ')}.`
```

This is the part people skip, and it matters more than the choice of embedding
model. "I want to help out with dogs on weekends in Brooklyn" only matches an
animal shelter listing if borough, schedule, and category are actually in the
embedded text.

Matching is then cosine similarity, which is a dot product over normalised
vectors:

```javascript
cosineSimilarity(a, b) {
  const dot = a.reduce((sum, x, i) => sum + x * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0))
  const magB = Math.sqrt(b.reduce((sum, x) => sum + x * x, 0))
  return dot / (magA * magB)
}
```

Because `normalize: true` is set at embedding time, the magnitudes are already 1
and the division is redundant. It costs nothing and it makes the function correct
if someone later turns normalisation off.

## The resulting split

<figure>
<svg viewBox="0 0 640 250" width="100%" role="img" aria-label="Architecture diagram: batched LLM call for intent, local vector search for retrieval" style="max-width:640px">
  <g font-size="11" fill="currentColor">
    <rect x="10" y="24" width="120" height="42" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
    <text x="70" y="42" text-anchor="middle">Bluesky</text><text x="70" y="56" text-anchor="middle">firehose</text>
    <rect x="10" y="96" width="120" height="42" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
    <text x="70" y="114" text-anchor="middle">30-second</text><text x="70" y="128" text-anchor="middle">buffer</text>
    <rect x="200" y="96" width="150" height="42" rx="6" fill="none" stroke="#2563eb" stroke-width="2"/>
    <text x="275" y="114" text-anchor="middle">LLM: intent</text><text x="275" y="128" text-anchor="middle">1 call / batch</text>
    <rect x="420" y="96" width="150" height="42" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
    <text x="495" y="114" text-anchor="middle">local vector search</text><text x="495" y="128" text-anchor="middle">0 calls</text>
    <rect x="420" y="176" width="150" height="42" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
    <text x="495" y="194" text-anchor="middle">15 NYC</text><text x="495" y="208" text-anchor="middle">opportunities</text>
  </g>
  <g stroke="currentColor" opacity="0.4" stroke-width="1.5" fill="none">
    <path d="M70 66 L70 94"/>
    <path d="M130 117 L198 117"/>
    <path d="M350 117 L418 117"/>
    <path d="M495 174 L495 140" stroke-dasharray="3 3"/>
  </g>
  <text x="365" y="240" font-size="10" fill="currentColor" opacity="0.6">embedded once, ahead of time</text>
</svg>
<figcaption>The only paid call is the batched classification. Retrieval never leaves the machine.</figcaption>
</figure>

Each half does what it is good at. The language model handles the part that is
genuinely about language: recognising intent in short, informal, ungrammatical
text and turning it into a clean search query. Embeddings handle the part that is
about geometry.

There is also a fully local variant that swaps the model for keyword matching. It
is meaningfully worse at intent, because "anyone know where I can help out this
weekend?" contains no keyword worth matching, but it costs nothing and needs no
network.

## Conclusion and future work

The system runs a language model over a live firehose for about a tenth of a cent
per hundred posts, and it does so by using the model only where language
understanding is required. Batched classification handles intent; local
embeddings handle retrieval. The pattern generalises to any high-volume stream
where most items are irrelevant: batch the filter, keep the downstream work
local, and let latency absorb the cost saving.

Where I would take it next:

- **Measure the keyword baseline properly.** My expectation is that keyword
  matching catches most explicit posts and misses the implicit ones, but I never
  quantified what fraction of real volunteering intent is implicit. That number
  decides whether the language model is doing necessary work or expensive work.
- **Use the confidence scores.** The model returns a per-post confidence that the
  current pipeline largely ignores. It is the natural knob for trading precision
  against recall, and it should drive the threshold rather than a hard-coded rule.
- **Reconsider the output.** The honest failure mode is that few people want a bot
  replying to their post. The more useful version of this is probably a periodic
  digest for volunteering organisations rather than an autoresponder aimed at
  individuals.
