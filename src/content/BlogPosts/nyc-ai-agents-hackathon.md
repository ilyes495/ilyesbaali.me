---
title: "A volunteer-matching agent at the NYC AI Agents Hackathon"
date: "2025-10-04"
excerpt: "Streaming Bluesky posts, detecting volunteering intent with an LLM, and matching them against NYC opportunities using local vector embeddings."
tags: ["Hackathon", "AI agents", "NLP"]
---

*Draft. Technical details are accurate; the story around them is still mine to write.*

At the NYC AI Agents Hackathon I built an agent that watches the public Bluesky firehose for people expressing an intent to volunteer, and matches them to concrete volunteering opportunities in New York City.

## The shape of the problem

Two things have to happen, and they pull in different directions. You need to recognize intent in messy, short, informal text, which is what language models are good at. And you need to match that intent against a catalogue of opportunities, which is a retrieval problem where calling an API per post would be both slow and expensive.

## What I built

- **Streaming.** A Jetstream connection to Bluesky, collecting posts in 30-second batches. A typical batch is 50 to 150 posts.
- **Intent detection.** The whole batch goes to the model in one call, which returns structured JSON per post: whether there is volunteering intent, a confidence score, and a semantic search query optimized for retrieval. Batching is what makes this affordable, roughly a tenth of a cent per hundred posts.
- **Matching.** Opportunities are embedded once with a local MiniLM model into 384-dimensional vectors. Matching is a local similarity search, so it costs nothing per post and works offline.

The split matters: the language model is used only where language understanding is needed, and retrieval stays local. There is also a fully offline variant that swaps the model for keyword matching, which is worse at intent but needs no API at all.

## What I'd write about next

- How often keyword matching was actually good enough.
- What batching does to latency, and whether it matters here.
- What it would take to make this useful rather than a demo.
