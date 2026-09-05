---
title: "The Virtual Cell Challenge"
date: "2026-09-01"
excerpt: "A competition asks models to predict how a cell reacts when you switch off one of its genes, in cell types the model has never seen. Here is what that involves, why it is harder than it sounds, and where my own attempt hits a wall."
tags: ["Machine learning", "Single cell", "Benchmarks"]
---

Suppose you could ask a computer what happens to a cell when you switch off one
particular gene — and trust the answer well enough to skip the experiment. That
is the goal behind the
[Virtual Cell Challenge](https://arcinstitute.org/virtual-cell-initiative), an
annual competition run by the Arc Institute.

I have been working on the 2026 edition. This post is an introduction to the
problem for people who can code but have never touched a pipette, and for
biologists who want to know why this is a hard machine learning problem rather
than a data-cleaning exercise. I define every term as it comes up, and every
number and figure below is measured from the actual challenge data.

## What a cell is actually doing

Start with the thing that surprises most people coming from software: **every
cell in your body contains the same genome.** A liver cell and a neuron carry
identical DNA. What differs is which genes each one is *using*.

A gene is a stretch of DNA that gets copied into RNA, and that RNA is usually
then translated into a protein that does something. **Gene expression** is how
much RNA a cell is currently making from a given gene — think of it as the volume
knob on that gene. The full set of RNA in a cell is its **transcriptome**.

![A row of grey gene ticks labelled as the genome, with two rows below showing a liver cell in orange and a neuron in green using different subsets of those same genes at different intensities.](./01-same-genes.svg)
*Same parts list; a different subset switched on, at different volumes. That pattern *is* the cell type, and it is what sequencing measures.*

So a cell type is not a different parts list. It is a different *configuration*
of the same parts list. The genome is the code; expression is the running
process. When you hear "cell context" in this field, that is what it means: which
genes are on, and how loudly.

## Reading a cell, one molecule at a time

**Single-cell RNA sequencing** measures that configuration one cell at a time.
You capture thousands of individual cells, attach a molecular barcode unique to
each one, sequence everything together, then use the barcodes to sort the reads
back into per-cell profiles.

What you get is a table.

![A table with one row per cell and one column per gene, integer counts in the body, and a label column naming the gene knocked down in each cell.](./02-counts-matrix.svg)
*A knockdown does not change one number — it shifts the whole row slightly, visible only by comparing hundreds of cells that got it against hundreds that did not.*

Rows are cells, columns are genes, and each entry counts how many RNA molecules
of that gene were caught in that cell. About **69% of that table is zero**.

Here is the part that trips up everyone modelling this data for the first time.
**A zero does not mean the gene is off.** Sequencing catches only a sample of the
molecules present, so a gene that is genuinely active can easily produce no reads
at all in a given cell. This is called **dropout**, and it is not a rare edge
case:

![A rising curve showing the fraction of cells in which a gene is detected against how strongly it is expressed: 2 percent at 1 CPM, 9 percent at 5 CPM, 31 percent at 20 CPM, 79 percent at 100 CPM.](./03-dropout.svg)
*This is *dropout*: a zero in the matrix often means "missed", not "off". It is why single cells have to be pooled before anything is claimed.*

A gene expressed at 5 counts per million — a real, functioning level — is detected
in under **10%** of cells. Even at 20 CPM it appears in about a third. Only well
above 100 CPM do you see it in most cells.

The consequence shapes everything downstream: **you cannot say much about any
individual cell.** Statements only become reliable when you pool hundreds of
cells that share a condition. That is why every method here works on
*populations*, and why, as we will see, submitting a single "best guess" cell
profile is catastrophically wrong.

## Switching a gene off on purpose

To find out what a gene does, turn it off and watch.

**CRISPR** is the tool. Its familiar form uses a protein called Cas9 which is
guided to a chosen spot in the genome by a short **guide RNA** — a piece of RNA
whose sequence matches the target — where it cuts the DNA. The variant used here
is **CRISPRi**, for CRISPR interference. It uses a Cas9 that has been
deliberately broken so it can no longer cut. It just parks on the gene's control
region and blocks the machinery that reads it.

The gene is not destroyed, it is turned down — typically to 10–30% of normal.
That is a **knockdown** rather than a knockout, and it is closer to real biology,
where genes are usually dialled rather than deleted.

Now combine the two ideas. Put a *different* guide RNA into each cell in a large
pool, so every cell has a different gene knocked down, then sequence all of them
at once. Each cell reports both which gene was targeted in it and what happened
to the other 18,000 genes. That is **Perturb-seq**, and one experiment can survey
hundreds of genes.

Two words you will keep meeting: a **perturbation** is one gene knocked down, and
a **context** is a particular kind of cell. The entire difficulty of this
challenge lives in the interaction between those two.

## What the challenge asks

The [2025 edition](https://arcinstitute.org/virtual-cell-initiative), the first,
released roughly 300,000 H1 human embryonic stem cells carrying 300 genetic
perturbations, split into fine-tuning, validation and test segments. Over 5,000
people registered from 114 countries, more than 1,200 teams submitted, and over
300 made final submissions, competing for a $100,000 grand prize sponsored by
NVIDIA, 10x Genomics and Ultima Genomics. The accompanying paper, *"Virtual Cell
Challenge: Toward a Turing test for the virtual cell"*, appeared in Cell in 2025.

The structural detail that matters: in 2025 you saw the target cell type
perturbed. You had H1 stem cells with many perturbations measured, and predicted
*different* perturbations in *that same cell type*. A model could learn what
responses look like in H1 specifically and fill in gaps — **interpolation**.

2026 removes that.

![Two grids of cell types by perturbations. In 2025 one cell type has its control and most perturbations measured; in 2026 three new cell types have only their control measured and every perturbation must be predicted.](./08-task-shift.svg)
*In 2025 the model saw one cell type responding and filled the gaps. In 2026 nothing about how the scored cell types respond can be learned before predicting them.*

There is no training set. You must predict knockdown responses in cell types you
have never seen perturbed, given only those cells sitting there unperturbed and a
list of genes to knock down. This is **zero-shot** prediction, and it demands
something categorically different: whatever the model knows about perturbations
has to come from *other* cell types and still apply here.

That is a genuinely open problem. Several 2025 benchmarking papers — most
pointedly a *Nature Methods* study called scPerturBench — reported that large
single-cell "foundation models" often fail to beat a trivial baseline that
predicts the same average response for every perturbation, and attributed it to
models not representing cellular context well.

## Looking at the data before modelling anything

Three questions are worth answering before writing a line of model code.

**How much signal is in one cell?**

![Three density curves, one per context, of the number of genes detected per cell out of the 18,533 measured. All three peak near 6,000, with a marked median of 5,939.](./04-genes-per-cell.svg)
*A typical cell reports about 5,900 of 18,533 genes, and nearly half the transcriptome is effectively silent in any one context.*

A typical cell yields around 20,000 RNA molecules spread across roughly **5,939
distinct genes out of 18,533**. And **47% of genes sit below 5 CPM** in any given
context, with 14% not detected at all. That is not a defect — it is cell identity
again. A skin cell does not run the neuronal program.

![Three stacked bars, one per context, splitting all 18,533 genes into silent, barely on, moderate and strong slices. Every context is about 13 to 15 percent silent and a further 33 percent barely on.](./05-transcriptome-mix.svg)
*Half of every transcriptome is silent or barely on — and a gene that is off cannot be knocked down any further.*

It has a blunt consequence for the task: **a gene that is switched off cannot be
knocked down further.** Any predicted change for those genes is noise wearing the
costume of signal.

**Are the three test contexts actually different?**

To see 18,000 dimensions at once you need to project them down. **PCA**
(principal component analysis) finds the directions along which the cells differ
most and plots the first two. It is a rigid rotation of the data, so the
distances you see are real distances — worth saying, because the other embedding
you will meet in this field, UMAP, preserves who your neighbours are but not how
far apart anything is.

![A scatter plot of the first two principal components of all 55,200 resting cells. Three well-separated clouds, blue for context A, orange for B, green for C.](./06-pca.svg)
*PCA is a rigid rotation, so these distances are real. A cell's resting state alone is enough to say which context it came from.*

Every one of the 55,200 control cells is plotted. Three tight, well-separated
clouds — the resting cells alone tell you which context they came from, before
any perturbation.

This is encouraging and discouraging at once. Encouraging, because the model *is*
told which context it must predict for — that information sits right there in the
control cells. Discouraging, because it confirms these are genuinely different
cell states, so an effect measured in one has no automatic right to apply in
another.

**And how do they differ, gene by gene?**

![Three scatter plots comparing control expression of every gene between pairs of contexts, with correlations of 0.78, 0.75 and 0.84 and over a thousand genes differing more than tenfold in each pair.](./07-context-vs-context.svg)
*Aggregate distributions match almost exactly; individual genes do not. That gap is what makes a context a context.*

The aggregate expression distributions of the three contexts are nearly
superimposable — plot the histograms and you would call them replicates. Gene by
gene they correlate at 0.75 to 0.84, and each pair has **over a thousand genes
differing more than tenfold**. Some are fully on in one context and silent in
another.

That gap is what makes a context a context. It is also exactly the thing a model
has to get right.


## Borrowing effects from other cell types

With no perturbation data in the target contexts, the only option is to borrow.
Public Perturb-seq datasets exist for several human cell lines, so you can
measure what each knockdown did *there* and carry it over.

![A table of six public screens listing cell type, tissue, number of perturbations, and how many of the 300 panel genes each covers.](./09-donor-screens.svg)
*Coverage is not the problem: 269 of the 300 panel genes were perturbed in all six screens.*

Six screens, spanning blood, colon, kidney and immune cells — the last of these
in three activation states, which turns out to matter. I rebuilt every one from
raw counts through a single pipeline rather than using the authors' published
fold changes. That sounds fussy and is not: different papers use different
normalisations, pseudocounts and definitions of "control", so mixing published
effect sizes silently mixes estimators and every downstream comparison inherits
the confusion.

Coverage is not the bottleneck. **269 of the 300 panel genes were perturbed in
all six screens.**

What you carry over is the **log fold change**: for each knockdown, how much each
gene moved relative to untouched control cells, on a log scale so that "doubled"
and "halved" are equal and opposite.

![A flow diagram: control cells and perturbed cells both feed into a step that averages each population gene by gene, which feeds into a step that divides the two averages and takes a log, giving one number per gene.](./10-effect-numbers.svg)
*Repeat for all 18,533 genes for one row, and for all 300 perturbations for the whole table. That table is the entire model.*

```python
# One number per (perturbation, gene): how much this gene moves
# when that gene is knocked down. log2, so +1 = doubled, -1 = halved.
effect = np.log2((perturbed_mean + eps) / (control_mean + eps))
```

Stack those numbers into a table with one row per perturbation and one column per
gene. I will call it the **effect table**.

![Left: a heatmap of 24 perturbations by 60 genes, blue where a gene goes down and red where it goes up. Right: the distribution of log fold changes, sharply peaked at zero.](./11-effect-table.svg)
*Most of the table is zero or tiny — the signal is a thin scatter of genes that genuinely move.*

Two things stand out. **59% of its entries are exactly zero**, because the gene
was not expressed in that screen and could not move. And the median non-zero
change is **0.10 on a log2 scale** — about a 7% shift. The heatmap shows the
texture: mostly near-nothing, with occasional rows where a perturbation moves
many genes at once, and a thin scatter of real effects everywhere else.

That table is the object we are betting on. So the obvious question is whether it
survives a change of cell type.

## The number that makes this hard

We can test that directly. Take two screens, find the perturbations they both
measured, and ask how similar their effect vectors are.

![Two scatter plots, one point per gene. Same cell type at different states: points lean along the diagonal, agreement 0.33. Different cell types: a round cloud, agreement 0.02.](./12-agreement-scatter.svg)
*Left: a gene pushed up in one screen tends to go up in the other. Right: a round cloud — knowing the effect in one cell type tells you almost nothing about the other.*

![A bar chart of agreement between pairs of screens on the same perturbation. Same-lineage pairs reach 0.25 to 0.33; every cross-lineage pair falls between 0.016 and 0.037.](./13-donor-agreement.svg)
*A tenfold drop the moment you cross cell types. This one number is the whole difficulty of the task.*

**Same lineage, different state** — CD4 T cells resting versus stimulated for
8 or 48 hours — agree at **0.25 to 0.33**. Not high, but clearly real.

**Different lineages** agree at **0.016 to 0.037**. Every single cross-lineage
pair. That is a **tenfold collapse** the moment you cross cell types.

This one measurement is the whole difficulty of the challenge. Knocking out a
gene in a blood cell and in a kidney cell produces effects that are, in direction,
almost unrelated. The shared, generic part of a stress response transfers fine.
The part that is specific to *which gene you hit* barely transfers at all — and
that specific part is exactly what the scoring rewards, because it is what
distinguishes one perturbation from another.

It also explains the benchmark results: if the transferable signal is this thin,
a large model has very little to be large about.

## Building the prediction

Given the effect table, there is still a decision to make, and it is the most consequential one
in the whole pipeline.

![Two flow diagrams. The first goes from a model directly to absolute expression. The second multiplies real resting cells from the target context by a fold change measured elsewhere.](./14-what-to-predict.svg)
*Which genes are on, at what level, and how much cells vary — all of it arrives with the target's own control cells.*

The tempting move is to have a model output the perturbed cell's expression
directly. The better move is to predict only the *change*, and apply it to real
resting cells drawn from the target context.

Why: those control cells already encode everything context-specific, for free.
Which genes are on, at what level, with how much cell-to-cell variation. You do
not have to model any of it, and you cannot get it wrong. All that remains is the
narrower question of how much each gene moves.

Put together, the pipeline is two steps:

![A two-step pipeline. Step one combines six donor screens by weighted average into tau, a 300 by 18,533 table. Step two multiplies tau by real resting cells from a target context and resamples counts into 400 predicted cells per perturbation.](./15-pipeline.svg)
*Step one never sees the target contexts. Step two runs once per context, and everything specific to that context arrives with its own cells.*

Step one happens once and knows nothing about the target contexts. Step two runs
per context and is where the target's own biology enters. The effect table is the model;
everything else is bookkeeping.

## First attempts, and what they teach

It is worth being concrete about the early, bad versions, because each failure
points at something the working version depends on.

![A scale from minus one to one. A bar for 400 identical cells extends to minus 0.81, the generic baseline sits at zero, a first transfer baseline sits just above it, and a dashed line marks the replicate anchor at one.](./16-simple-baselines.svg)
*The naive submission is not merely weak — it is far worse than saying nothing, because several scoring components run tests that need variation between cells.*

**Predict one average response for everything.** This is the scoring rule's zero
point, so it scores 0 by construction. It is a real strategy, though: if
perturbation effects were mostly a shared stress response, it would be hard to
beat — and it is the baseline the benchmark papers found foundation models
struggling to exceed.

**Predict 400 identical cells carrying the correct average profile.** This feels
*more* accurate than the previous idea and scores dramatically worse: about
**−0.81**, far below doing nothing. Several scoring components run statistical
tests for differential expression, comparing perturbed cells against controls.
Those tests need cell-to-cell variation. Give them 400 copies of one profile and
the variance is zero, the tests degenerate, and the components collapse. This is
the dropout lesson from earlier arriving with a bill attached: **you are
submitting a population, and its spread is part of the prediction.**

**Apply one other cell line's measured effects.** This clears zero, modestly, and
was enough for rank 167. A weak model, but it establishes the thing everything
else depends on: perturbation effects do partially transfer.

Combining all six screens and being careful about how the simulated cells are
generated took it from **rank 167 to 58, and then to 45**. I will stop short of
the specifics of the better-performing versions — the competition is still
running, and writing those up in detail is not really in the spirit of it.

## How submissions are scored

You submit simulated cells: 400 for every (context, perturbation) pair, which
comes to 360,000 cells by 18,533 genes. Six components are computed and averaged.
They are worth going through properly, because they do not measure the same thing
and a change that helps one routinely hurts another.

**The common scale.** Every component starts as a raw quantity `u`, which is then
rescaled against a **baseline** `b` — the score of a generic average response —
and an **anchor**, the score of a perfect prediction. For the components where
lower is better and perfect is zero:

```text
score = 1 − u / b
```

and for those where higher is better and perfect is one, `score = (u − b)/(1 − b)`.
So **0 means "no better than predicting one average response for everything"** and
**1 means "as good as repeating the experiment"** — the real cells split in half,
one half scored against the other. That upper anchor is the honest one: reaching
it means being as close to the truth as the biology is to itself.

Write **d** for the predicted change of one perturbation (a vector over genes) and
**Δ** for the true one.

### 1. Perturbation discrimination — did you predict *this* perturbation?

For each perturbation, compare your predicted change to the true change of **all
300** perturbations, and see where the right one ranks:

```text
u_p = 1 − rank_p / D
```

`rank_p` is the position of the correct match when all real effects are sorted by
cosine distance to your prediction. Get it first and you score 1; land in the
middle and you score 0.5, which is chance.

This is a *retrieval* metric, not an accuracy metric. It does not ask whether your
prediction is close to the truth — it asks whether it is closer to the right truth
than to the 299 wrong ones. And because the distance is a **cosine**, it is
completely blind to magnitude: scaling every prediction by ten changes nothing.

### 2. Expression accuracy — is the predicted profile close?

```text
u = Σ_p ‖d_p − Δ_p‖²  /  Σ_p ‖Δ_p‖²
```

Squared error between predicted and true change, divided by how large the true
change was, summed over perturbations. Unlike discrimination this sees magnitude:
a prediction pointing the right way but twice too far is penalised.

### 3. Fold-change accuracy — are the sizes right?

Restricted to genes that genuinely changed in the real data:

```text
u_p = mean_g |lfc_pred,g − lfc_real,g|  /  mean_g |lfc_real,g|
```

Average error in the size of each change, relative to the true size. This one has
a property worth internalising: **predict no change at all and the numerator
becomes the denominator**, so you land exactly on the reference point. Predicting
zero is not free — you forfeit everything else — but it is a floor this component
alone cannot punish you below.

### 4. Direction fidelity — right genes, right way?

```text
u_p = k / max(n_pred, n_conf)
```

`k` counts genes you flagged as changed whose direction matches the reference,
`n_pred` is how many you flagged, `n_conf` how many the reference is confident
about. The `max` in the denominator is the interesting part: flag too few and
`n_conf` dominates, flag too many and `n_pred` does. Both are punished, so you
cannot game it by calling everything or nothing.

### 5. Direction reach — how deep does your ranking stay right?

Rank your predicted changes by confidence and walk down the list, tracking the
running fraction whose direction is correct. Let `k*` be the deepest point where
that fraction is still at least 0.9:

```text
u_p = k* / n_conf
```

Fidelity asks whether your calls are right. Reach asks how far down your ordering
survives before it stops being right — it rewards a well-ordered prediction, not
just an accurate one.

### 6. Significance overlap — did you flag the same genes?

```text
u_p = |R ∩ P| / |R ∪ P|
```

`R` is the set of genes significantly changed in the real data, `P` the set in
your prediction, with the knocked-down gene itself excluded from both — reporting
that the gene you switched off went down is the premise of the experiment, not a
prediction. This is a plain Jaccard index: of all genes either side flagged, what
fraction did both.

### What this means in practice

![A grid of the six scored components against four things a submission controls: direction, magnitude, how many genes are called changed, and cell-to-cell variation. Filled circles mark strong sensitivity, half circles weak, empty circles none.](./17-metric-sensitivity.svg)
*Discrimination is blind to magnitude; fold-change accuracy sees little else; the three differential-expression components all need cell-to-cell spread.*

Reading that grid tells you why the task resists easy wins.

**Discrimination cannot see magnitude at all**, because a cosine is
scale-invariant. **Fold-change accuracy sees almost nothing else.** So a change
that sharpens direction while inflating magnitudes moves those two components in
opposite directions, and the total barely shifts. Several quite different ideas I
tried landed on nearly the same overall score for exactly this reason — I was
sliding along a trade-off curve rather than stepping off it. The useful question
turned out to be not "which component can I push?" but "is the underlying
prediction actually more accurate?", because only that moves several at once.

The right-hand column explains the identical-cells disaster from earlier. The
three differential-expression components all depend on statistical tests
comparing your perturbed cells against controls, and those tests need
**cell-to-cell variation**. Emit 400 copies of one profile and the variance is
zero, the tests degenerate, and half the scoreboard collapses — which is how a
submission can land far below simply doing nothing.

## Why it stays hard

One thing stands out after a few weeks, beyond the trade-off above.

Measurement noise is larger than intuition suggests. In a published 2026
Perturb-seq study spanning 16 cell lines, each gene was targeted by two
independent guide RNAs in the same line. Those are two measurements of the same
biological thing, and they agree only modestly — not far above the agreement
between *different* cell lines. Since predictions are scored against one noisy
measurement, some of the apparent error is irreducible, and some of what looks
like poor transfer is the noise floor of the assay showing through.

## Conclusion and future work

The 2026 challenge is a much cleaner test than the 2025 one. Withholding
perturbation data entirely for the scored cell types stops rewarding models that
memorise one cell type and forces the real question: has anything general been
learned about how genes regulate each other?

My own results say a careful, simple approach gets surprisingly far; that the
largest early gains came from respecting the structure of the data rather than
from model capacity; and that the remaining gap is not obviously closed by
building something bigger. The tenfold drop in cross-lineage agreement is,
I think, the single most important number for anyone starting on this.

Where I would take it next:

- **Understand the noise floor before chasing accuracy.** If two guides against
  the same gene in the same cell line agree only moderately, the ceiling on any
  predictor is lower than the metric implies, and the right target may be the
  reproducible part of the response rather than the measurement.
- **Use the resting state more aggressively.** The embeddings show control cells
  identify their context unambiguously. Turning that identity into a prediction of
  *how strongly* each gene will respond is the open question.
- **Treat public perturbation data as one dataset, not many.** Rebuilding
  everything from raw counts through a single pipeline is unglamorous and repaid
  itself immediately.
- **Design for the population, not the average.** The identical-cells failure is
  the clearest lesson of the exercise: the distribution you emit is part of the
  prediction, not a presentation detail.
