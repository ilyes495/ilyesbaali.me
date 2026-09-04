---
title: "The Virtual Cell Challenge"
date: "2026-09-01"
excerpt: "The Arc Institute's Virtual Cell Challenge asks models to predict how gene expression shifts after a perturbation. Notes on the problem and on the 2026 zero-shot format."
tags: ["Machine learning", "Single cell", "Benchmarks"]
---

*Placeholder. I have written up the public framing of the challenge below; my own participation, approach, and results still need to be written.*

## The challenge

The [Virtual Cell Challenge](https://arcinstitute.org/virtual-cell-initiative) is an annual competition run by the Arc Institute in which models predict how gene expression shifts in response to genetic perturbations.

The inaugural 2025 edition released a dataset of roughly 300,000 H1 human embryonic stem cells with 300 genetic perturbations, split into fine-tuning, validation, and test segments. Over 1,200 teams submitted results.

The [2026 edition](https://arcinstitute.org/news/virtual-cell-challenge-2026) changes the problem in a way I find more interesting: it is zero-shot. No training set is released. Models must predict CRISPRi knockdown responses in six cell lines they have never seen perturbed, given only the unperturbed state of those cells and a list of genes to knock down.

## Why the zero-shot framing matters

Predicting a perturbation response in a cell type you have seen perturbed is largely an interpolation problem. Predicting it in a cell type you have only seen at baseline asks whether a model has learned something transferable about regulatory structure, rather than memorizing a response manifold. That is much closer to what a virtual cell would need to do to be useful.

## To write

- What I tried, and what the baseline was.
- Where the model failed, and whether the failures were cell-type specific.
- How this connects to benchmarking work like mRNABench.
