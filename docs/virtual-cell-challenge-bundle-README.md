# Blog post bundle — Virtual Cell Challenge

## What to copy

Everything sits flat in this one folder — the markdown and seventeen SVGs beside
it — so grabbing the parent folder gets the whole post:

```bash
scp -r <user>@<host>:/data1/morrisq/baalii/CRISPRi/portfolio/virtual-cell-challenge \
       ~/Downloads/
```

Then drop the contents into your content collection:

```bash
DEST=/Users/ilyes/Documents/ilyesbaali-astro/src/content/blog
cp ~/Downloads/virtual-cell-challenge/virtual-cell-challenge.md "$DEST/"
cp ~/Downloads/virtual-cell-challenge/*.svg                     "$DEST/"
```

The post is 27 KB; all seventeen SVGs together are 450 KB. `README.md` is for
you, not the site — do not copy it across.

## Editing the figures

They are plain hand-authored SVG: shapes and `<text>` elements with readable
coordinates, no generated blobs, no embedded fonts. Open one in any editor and
the labels are right there as text.

Colour is handled through `currentColor`, so a figure inherits the surrounding
text colour when the SVG is inlined. Referenced from markdown it loads as an
`<img>`, where nothing supplies that colour, so each root carries
`color="#1b1b1f"`. **Delete that one attribute** if you inline the SVGs instead
and want them to follow your light/dark theme automatically.

Two figures (`06-pca`, `07-context-vs-context`, `11-effect-table`) contain
thousands of plotted points as compact `<path>` data — editable, but the point
data is not meant to be hand-tuned. Regenerate those from
`scripts/blog_embed_fig.py`, `scripts/blog_figs.py` and
`scripts/blog_agree_fig.py`.

## One thing to be aware of: PNGs cannot follow the theme

SVGs are resolution-independent, so nothing is baked at a fixed size and there is
no retina concern. Each declares `width="100%"` with a `max-width` of 640 px, so
they scale to the column and stop before becoming oversized.

## The seventeen figures

| file | what it shows | source |
|---|---|---|
| `01-same-genes` | one genome, two cell types using different subsets | concept |
| `02-counts-matrix` | the measurement as a table, with the perturbation label | concept |
| `03-dropout` | detection rate vs expression; markers read off the curve | measured |
| `04-genes-per-cell` | genes detected per cell, per context (median 5,939) | measured |
| `05-transcriptome-mix` | silent / barely on / moderate / strong, per context | measured |
| `06-pca` | PCA of all 55,200 control cells | measured |
| `07-context-vs-context` | gene-by-gene scatter, all three pairs | measured |
| `08-task-shift` | 2025 interpolation vs 2026 transfer | concept |
| `09-donor-screens` | the six screens, perturbation counts, panel coverage | measured |
| `10-effect-numbers` | how one effect number is derived, with a worked example | concept |
| `11-effect-table` | a heatmap slice plus the value distribution | measured |
| **`12-agreement-scatter`** | **what agreement looks like: real effects, two screens** | measured |
| `13-donor-agreement` | same-lineage 0.25–0.33 vs cross-lineage 0.016–0.037 | measured |
| `14-what-to-predict` | absolute expression vs predicting only the change | concept |
| `15-pipeline` | screens → six tables → weighted average → applied → emitted | concept |
| `16-simple-baselines` | where early attempts land, incl. identical cells at −0.81 | measured |
| **`17-metric-sensitivity`** | **which components respond to which knobs** | derived from source |


Figures 2 and 3 are computed from the challenge data itself; the numbers in them
are measurements, not illustrations. Sources and generators are kept in the
project at `results/portfolio_figure_sources/*.svg` and
`scripts/mk_pca_full.py` / `scripts/mk_more_figs.py`.

Alt text describes what is drawn; the italic line under each image states the
takeaway. They are deliberately different so a screen reader does not announce
the same sentence twice.

## Departures from the brief, all deliberate

- **Images instead of inline SVG**, at your request.
- **Five figures rather than two**, at your request.
- Everything else follows it: frontmatter keys `title` / `date` / `excerpt` /
  `tags`; a three-word plain title; nine `##` sections closing with
  `## Conclusion and future work`; no H1; no emoji; no horizontal rules; fenced
  `python` blocks under 20 lines.

## What is held back

Leaderboard progress appears once, as "from rank 167 to 58 and then to 45" — no
scores, no later ranks, no per-metric numbers. The early and failed approaches are
described in full, since that is where the teaching is and there is no advantage
in them. The better-performing versions are named and then explicitly set aside
while the competition is running.

Three earlier raster figures that *did* contain competitive detail — leaderboard
scores, my accuracy against the leaders', the metric trade-off — are in
`results/portfolio_extra_figures/`, deliberately outside this bundle.

## A correction worth knowing about

An earlier draft claimed ~60% of genes sit below 5 CPM. Recomputed from the
counts it is **47%**, with 14% entirely undetected. The figure had been generated
but the numbers never read back. The post now carries verified values throughout.

Numbers current as of 2026-09-04.

## This round of fixes

- **Dropout markers now sit on the curve.** They had been read from a separate
  narrow-band statistic and disagreed with the plotted line by a few points; they
  are interpolated off the curve itself now, and the prose was corrected to match
  (5 CPM is under 10%, not 13%).
- **Figure 4's right panel is gone.** Its cumulative thresholds restated figure 3
  on the same axis. Replaced by `05-transcriptome-mix`, which is compositional and
  per-context, so it carries different information.
- **PCA and UMAP separated.** The post keeps PCA only. The UMAP is at
  `results/blog/umap-standalone.png` for your own curiosity, not in the bundle.
- **Donor table**: the perturbation bar is dropped — all six were the same order
  of magnitude, so it carried no information and the value label kept landing on
  top of it.
- **"τ" is gone**, replaced throughout by "the effect table".
- **New figure `10-effect-numbers`** derives one effect number from two cell
  populations, with a worked example (100 → 50 → −1), since how you *get* to the
  table was previously assumed.
- **`12-donor-agreement` explains its own measurement** in a band across the top:
  each row is an arrow, the number is the angle between them, 1.0 = same
  direction, 0 = unrelated.
- **Pipeline arrows and labels realigned.**
- Found and fixed a rendering trap: a `<tspan>` inside a `text-anchor="middle"`
  element mispositions under cairosvg (browsers handle it), which had mangled a
  label. Worth knowing if you edit the SVG sources.

## This round of fixes

- **The agreement illustration is now real data.** The abstract two-arrow inset is
  replaced by `12-agreement-scatter`: one perturbation's effect on every gene,
  plotted screen-against-screen, for a same-lineage pair (leans along the
  diagonal, 0.33) and a cross-lineage pair (a round cloud, 0.02). Both are the
  *median*-agreement perturbation for that pair, so neither is cherry-picked.
  Panels are scaled to their own data rather than a fixed range.
- **Pipeline reordered and aligned.** The weighted average was drawn between the
  screens and their tables, which is the wrong step — it belongs between the six
  tables and the single effect table, and that is where it now sits. Boxes are
  vertically centred on their arrows.
- **A metrics section, with equations.** Each of the six scored components now has
  its formula, a plain-language reading, and a note on what it is blind to —
  discrimination cannot see magnitude at all, fold-change accuracy sees little
  else, and predicting zero change lands exactly on that component's reference
  point. Definitions were read out of the scorer's source rather than its
  documentation.
- **New figure `17-metric-sensitivity`** crosses the six components against the
  four things a submission controls (direction, magnitude, how many genes you
  call, cell-to-cell spread), which is what makes the trade-offs legible and
  explains the identical-cells collapse.

## This round of fixes

- **SVG instead of PNG**, so every label is editable text.
- **Prose removed from the figures.** Sixteen explanatory sentences were living
  inside the artwork; they are now captions under each figure, where they can be
  reworded without opening a drawing. Figures keep only titles, axis and data
  labels, and legends.
- **`01-same-genes` gained a colour key** to replace the sentence that had been
  carrying that information.
- **Every viewBox is now measured, not guessed.** `scripts/blog_fit_viewbox.py`
  renders each figure on a transparent ground, finds where the ink actually stops,
  and sets the height from that. It is idempotent and it caught two figures the
  earlier hand-trimmed heights had clipped.
- **The agreement figure was reflowed** after its explainer band came out, so the
  bars start directly under the subtitle instead of leaving a gap.
