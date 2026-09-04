---
title: "Designing a GPCR biosensor in a weekend at the YC Bio × AI Hackathon"
date: "2026-03-08"
excerpt: "What we built at the Y Combinator Bio × AI Hackathon: an automated pipeline that designs SSTR2 biosensors by co-evolving cpGFP insertion sites and linkers, with structure prediction and an LLM agent in the loop."
tags: ["Hackathon", "Protein design", "AI agents"]
---

*Draft. This is a skeleton with the technical details filled in from the project repository. The narrative and personal takeaways are still mine to write.*

At the Y Combinator Bio × AI Hackathon in San Francisco, our team built an automated protein-engineering pipeline that designs an SSTR2 GPCR biosensor. The code is on [GitHub](https://github.com/hetpatel-11/YC-Bio-Hack).

## The problem

Genetically encoded biosensors report on receptor activity by inserting a circularly permuted fluorescent protein into a receptor, so that ligand binding shifts fluorescence. For the somatostatin receptor SSTR2, the sensor is built by inserting circularly permuted GFP into intracellular loop 3. When somatostatin-28 binds the extracellular face, the conformational change propagates to the insertion site.

The engineering question is where exactly to insert, and what linker sequences to use on either side. Insert in the wrong place and the receptor stops folding. Use the wrong linkers and the conformational change never reaches the fluorophore. The search space is large and each evaluation is expensive.

## What we built

A six-stage pipeline that narrows the space cheaply before spending on structure prediction:

1. **Genetic algorithm.** Population of 30 over 40 generations, scoring candidates locally with BLOSUM62 conservation against wild-type, a seven-helix topology check, and a cpGFP brightness and linker-compatibility heuristic. No API calls, so thousands of evaluations per second.
2. **ESMFold scoring.** The top 50 sequences get folded, giving a pLDDT per candidate.
3. **Orthogonal validation.** Molecular dynamics windows, Rosetta filter hits, and lab assay anchors are blended into a single validation score.
4. **Agent selection.** A Claude agent reads the structural and orthogonal signals and picks a diverse shortlist of five, avoiding near-duplicates, and writes its rationale.
5. **AlphaFold2 multimer.** The shortlist is folded against somatostatin-28 to get an ipTM interface score.
6. **Composite ranking.** A weighted score over pLDDT, ipTM, sequence conservation, local fitness, and validation.

## What I'd write about next

- Why the cheap local scorers mattered more than the expensive ones.
- Where the agent added something a ranking function could not.
- What I would change with more than a weekend.
