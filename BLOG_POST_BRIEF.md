# Brief: write the "Virtual Cell Challenge" blog post

You are writing **one markdown file**. You have no access to the site repo, so this
brief is self-contained. Return only the file contents.

## Deliverable

Filename: `virtual-cell-challenge.md`
It replaces an existing placeholder of the same name.

## Frontmatter (required, exact keys)

```markdown
---
title: "The Virtual Cell Challenge"
date: "2026-09-01"
excerpt: "One or two sentences, plain text, no markdown. Shown on the blog index."
tags: ["Machine learning", "Single cell", "Benchmarks"]
---
```

- `date` is a quoted `YYYY-MM-DD` string. Rendered in UTC.
- `tags` must be non-empty. The **first tag** becomes the badge on the index card.
- Keep the title short and plain (2–4 words). Do not add a subtitle after a colon.

## Structure

- Body starts immediately after the frontmatter. **No H1** — the title renders from
  frontmatter.
- Use `##` for sections and `###` for subsections. These auto-generate the
  "Content" sidebar table of contents, so section headings should be short and
  scannable.
- Aim for 6–9 `##` sections.
- The final section must be `## Conclusion and future work`: open with a short
  paragraph on what the work achieved, then 2–4 bullets on next steps.

## Voice

- First person, singular. The author is Ilyes Baali, a computational biologist
  (PhD, Weill Cornell / MSKCC) who works on machine learning for RNA biology.
- Educational, not a lab report. Explain the concept before the result. Assume a
  reader who knows ML but not single-cell biology, or vice versa — define the
  jargon from whichever side is being used.
- Explain *why* a design choice was made, not just what it was.
- Prefer concrete numbers over adjectives.

## Figures

Inline SVG only. No external images, no image files, no mermaid.

- Wrap in `<figure>` … `<figcaption>` … `</figure>`.
- Use `stroke="currentColor"` / `fill="currentColor"` for anything that must stay
  legible in both light and dark themes.
- Use `#2563eb` (blue) only for the one element you want to emphasise.
- Include `viewBox`, `width="100%"`, `role="img"`, `aria-label`, and
  `style="max-width:640px"`.

Skeleton:

```html
<figure>
<svg viewBox="0 0 640 220" width="100%" role="img" aria-label="…" style="max-width:640px">
  <rect x="10" y="20" width="140" height="44" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
  <text x="80" y="47" text-anchor="middle" font-size="11" fill="currentColor">label</text>
</svg>
<figcaption>One sentence saying what the reader should take from it.</figcaption>
</figure>
```

Two figures is a good target.

## Code

Fenced blocks with an explicit language (```python, ```javascript, ```text).
Syntax highlighting is automatic — do not add HTML or inline styles. Keep blocks
under ~20 lines and comment the line that carries the idea. Use inline `code` only
for identifiers.

## Content brief

The [Virtual Cell Challenge](https://arcinstitute.org/virtual-cell-initiative) is
an annual competition from the Arc Institute in which models predict how gene
expression shifts in response to genetic perturbations. Verified facts:

- **2025 (inaugural).** Arc released ~300,000 H1 human embryonic stem cells with
  300 genetic perturbations, split into fine-tuning, validation and test segments.
  Over 5,000 people registered across 114 countries; 1,200+ teams submitted;
  300+ made final submissions. $100,000 grand prize. Sponsors: NVIDIA,
  10x Genomics, Ultima Genomics.
- **2026.** Zero-shot: no training set released. Models must predict CRISPRi
  knockdown responses in six cell lines they have never seen perturbed, given only
  the unperturbed state of those cells and a list of genes to knock down. The
  evaluation dataset is substantially larger than 2025's.
- The framing paper is *"Virtual Cell Challenge: Toward a Turing test for the
  virtual cell"*, Cell (2025).

Suggested angle, if the author has not specified one: the shift from 2025 to 2026
turns the task from interpolation (predicting a perturbation response in a cell
type you have seen perturbed) into a test of transferable regulatory structure.
That is the part worth explaining to a reader.

## Hard constraints

- **Do not invent the author's participation, approach, or results.** If the
  author has not supplied them, write the sections that explain the problem, and
  leave clearly-marked placeholders such as `<!-- TODO: my approach -->` for the
  rest. Do not fabricate scores, rankings, model names, or anecdotes.
- Do not claim a placement or prize.
- Cite external claims with inline markdown links.
- No emoji. No horizontal rules between every section.

## Sibling posts, for tone calibration

- *Engineering a GPCR biosensor* — designing a fluorescent biosensor by searching
  insertion sites with a genetic algorithm, then confirming with structure
  prediction. Sections: what a biosensor is → why it is a search problem →
  pipeline stages → conclusion and future work.
- *Intent detection at firehose scale* — running an LLM over a live social feed
  cheaply by batching classification and keeping retrieval local. Sections: naive
  design and why it fails → the two fixes → resulting architecture → conclusion
  and future work.

Both open by framing a problem, spend the middle explaining mechanism, and close
with honest limitations.
