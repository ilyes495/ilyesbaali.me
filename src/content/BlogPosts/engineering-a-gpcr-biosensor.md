---
title: "Engineering a GPCR biosensor"
date: "2026-03-08"
excerpt: "How to search for the right place to cut a receptor open and insert a fluorescent protein, using a genetic algorithm to propose candidates, structure prediction to score them, and a language model to shortlist."
tags: ["Protein design", "Structure prediction", "AI agents"]
---

*Draft. The technical content is accurate; the personal narrative is still mine to write.*

At the Y Combinator Bio × AI Hackathon I worked on a pipeline that designs a
somatostatin receptor biosensor. This post is about the design problem itself,
which is a nice example of a search problem where every good scoring function is
too expensive to use on the whole search space. Code is on
[GitHub](https://github.com/hetpatel-11/YC-Bio-Hack).

## What a genetically encoded biosensor is

A G-protein-coupled receptor changes shape when its ligand binds. That shape
change is the signal, but it is invisible. The trick behind a genetically encoded
biosensor is to make the receptor report on itself: you cut it open at a point
that moves during activation, and you splice in a **circularly permuted
fluorescent protein** whose brightness depends on the strain in its own barrel.

Circular permutation matters here. A normal GFP is a closed beta barrel with the
chromophore protected inside, and its brightness barely changes when you tug on
the ends. A circularly permuted GFP has been cut and rejoined so that its new
termini sit right next to the chromophore. Now mechanical strain transmitted
through those termini changes the chromophore's environment, and therefore the
fluorescence. This is the same principle behind the GCaMP calcium sensors.

For the somatostatin receptor SSTR2, the natural insertion point is intracellular
loop 3, which sits between transmembrane helices 5 and 6 and swings outward on
activation.

<figure>
<svg viewBox="0 0 640 260" width="100%" role="img" aria-label="Diagram of the SSTR2 receptor in the membrane with cpGFP inserted into intracellular loop 3" style="max-width:640px">
  <g stroke="currentColor" fill="none" stroke-width="1.5" opacity="0.35">
    <line x1="40" y1="70" x2="600" y2="70"/>
    <line x1="40" y1="180" x2="600" y2="180"/>
  </g>
  <text x="46" y="60" font-size="12" fill="currentColor" opacity="0.7">extracellular</text>
  <text x="46" y="200" font-size="12" fill="currentColor" opacity="0.7">cytoplasm</text>
  <g stroke="currentColor" stroke-width="12" stroke-linecap="round" opacity="0.55">
    <line x1="120" y1="80" x2="120" y2="170"/>
    <line x1="160" y1="80" x2="160" y2="170"/>
    <line x1="200" y1="80" x2="200" y2="170"/>
    <line x1="240" y1="80" x2="240" y2="170"/>
    <line x1="280" y1="80" x2="280" y2="170"/>
    <line x1="340" y1="80" x2="340" y2="170"/>
    <line x1="380" y1="80" x2="380" y2="170"/>
  </g>
  <text x="276" y="72" font-size="11" fill="currentColor" opacity="0.75">TM5</text>
  <text x="332" y="72" font-size="11" fill="currentColor" opacity="0.75">TM6</text>
  <path d="M280 176 C 290 210, 330 210, 340 176" stroke="#2563eb" stroke-width="2.5" fill="none"/>
  <circle cx="310" cy="205" r="16" fill="#2563eb" opacity="0.85"/>
  <text x="310" y="209" font-size="10" text-anchor="middle" fill="#ffffff">cpGFP</text>
  <text x="310" y="240" font-size="11" text-anchor="middle" fill="currentColor" opacity="0.75">inserted in ICL3</text>
  <circle cx="200" cy="45" r="13" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <text x="222" y="49" font-size="11" fill="currentColor" opacity="0.8">somatostatin-28</text>
  <path d="M200 58 L200 74" stroke="#2563eb" stroke-width="2" marker-end="url(#a)"/>
  <defs><marker id="a" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#2563eb"/></marker></defs>
</svg>
<figcaption>Ligand binding on the extracellular face propagates a conformational change to intracellular loop 3, where the circularly permuted GFP reports it as a fluorescence shift.</figcaption>
</figure>

## Why this is a search problem

Two things have to be decided: **where** in the loop to insert, and **what linker
sequences** to place on each side of the insert. Both matter, and they trade off
against each other.

Insert too close to a transmembrane helix and you disrupt folding, so the
receptor never reaches the membrane. Insert too far into the flexible middle of
the loop and the conformational change dissipates before it reaches the
fluorophore. Linkers have the same tension: short, rigid linkers transmit strain
well but strain the fold; long, flexible linkers fold fine and report nothing.

If you allow, say, 20 candidate insertion positions and two linkers of four
residues each drawn from a reduced alphabet of 10 amino acids, that is already
20 × 10⁴ × 10⁴ combinations. You cannot fold two billion structures.

## The shape of the solution: cheap search, expensive confirmation

The pipeline is built around one idea: **make the expensive scorers see as few
candidates as possible.** Six stages, and the first one does almost all the work.

<figure>
<svg viewBox="0 0 660 150" width="100%" role="img" aria-label="Pipeline diagram narrowing from thousands of candidates to five" style="max-width:660px">
  <g font-size="11" fill="currentColor">
    <g opacity="0.9">
      <rect x="8" y="40" width="112" height="46" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
      <text x="64" y="60" text-anchor="middle">genetic</text><text x="64" y="74" text-anchor="middle">algorithm</text>
      <rect x="140" y="40" width="112" height="46" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
      <text x="196" y="60" text-anchor="middle">ESMFold</text><text x="196" y="74" text-anchor="middle">pLDDT</text>
      <rect x="272" y="40" width="112" height="46" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
      <text x="328" y="60" text-anchor="middle">orthogonal</text><text x="328" y="74" text-anchor="middle">validation</text>
      <rect x="404" y="40" width="112" height="46" rx="6" fill="none" stroke="#2563eb" stroke-width="2"/>
      <text x="460" y="60" text-anchor="middle">LLM agent</text><text x="460" y="74" text-anchor="middle">shortlist</text>
      <rect x="536" y="40" width="112" height="46" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
      <text x="592" y="60" text-anchor="middle">AlphaFold2</text><text x="592" y="74" text-anchor="middle">ipTM</text>
    </g>
    <g opacity="0.7" font-size="10">
      <text x="64" y="108" text-anchor="middle">~10⁴ evaluated</text>
      <text x="196" y="108" text-anchor="middle">50 folded</text>
      <text x="328" y="108" text-anchor="middle">50 scored</text>
      <text x="460" y="108" text-anchor="middle">5 chosen</text>
      <text x="592" y="108" text-anchor="middle">5 folded</text>
    </g>
    <g opacity="0.55" font-size="10">
      <text x="64" y="128" text-anchor="middle">free</text>
      <text x="196" y="128" text-anchor="middle">~50 API calls</text>
      <text x="328" y="128" text-anchor="middle">free</text>
      <text x="460" y="128" text-anchor="middle">1 API call</text>
      <text x="592" y="128" text-anchor="middle">~5 API calls</text>
    </g>
  </g>
  <g stroke="currentColor" opacity="0.4" stroke-width="1.5">
    <path d="M120 63 L138 63"/><path d="M252 63 L270 63"/><path d="M384 63 L402 63"/><path d="M516 63 L534 63"/>
  </g>
</svg>
<figcaption>Roughly 95 structure-prediction calls total. Everything else is local.</figcaption>
</figure>

### Stage 1: a genetic algorithm with only free scorers

The genetic algorithm ran a population of 30 for 40 generations. What makes it
work is that its fitness function calls no APIs at all, so it can afford
thousands of evaluations per second. Three cheap signals stand in for structure:

- **Conservation.** How far each substitution strays from wild-type SSTR2,
  scored with BLOSUM62. Mutations in the transmembrane helices are penalized hard.
- **Topology.** A check that the sequence still looks like a seven-helix receptor.
  This is a fast filter that catches the catastrophic cases early.
- **Fluorophore compatibility.** A heuristic for whether the linker composition is
  compatible with a bright, well-folded cpGFP.

Simplified, the fitness function looks like this:

```python
def fitness(candidate, wild_type):
    """Cheap local score. No structure prediction, no API calls."""
    conservation = blosum62_similarity(candidate.seq, wild_type.seq)
    if not has_seven_tm_helices(candidate.seq):
        return 0.0                      # catastrophic fold, discard early
    brightness = cpgfp_linker_score(candidate.linker_n, candidate.linker_c)
    return 0.5 * conservation + 0.5 * brightness
```

The point is not that these proxies are accurate. They are not. The point is that
they are **correlated enough** to concentrate the population in a region where the
expensive scorers are worth spending on.

### Stage 2: ESMFold, and what pLDDT actually tells you

The top 50 sequences get folded with ESMFold, which returns a **pLDDT**: the
model's own estimate, per residue, of how much it would agree with the true
structure. Above roughly 70 usually means a confident fold; below 50 usually means
disordered or wrong.

pLDDT is a confidence score, not a quality score. A design can fold confidently
into something useless. It is a good filter for "did I break the protein" and a
poor one for "will this sensor work."

### Stage 4: what the language model added

An agent reads the structural scores plus the orthogonal signals and picks five
candidates to send to the expensive stage, with a written rationale.

The obvious objection is that a ranking function could do this. The reason it
does not is **diversity**. A genetic algorithm converges, so the top 50 by score
are frequently near-duplicates of each other, differing by one or two residues.
Sending five near-identical designs to AlphaFold2 wastes four of the five most
expensive calls in the pipeline. Asking a model to pick five *different* good
candidates, and to say why, is a cheap way to get that spread without hand-tuning
a diversity penalty.

### Stage 5: AlphaFold2 multimer and ipTM

The shortlist is folded together with somatostatin-28. The number that matters
here is **ipTM**, the interface predicted TM-score: how confident the model is
about the relative placement of the two chains, rather than each chain alone.
This is the closest cheap proxy to the question we actually care about, which is
whether the receptor still binds its ligand after being cut open.

The final ranking blends everything:

```
score = 0.30 · (pLDDT / 100)   # does it fold
      + 0.30 · ipTM            # does it still bind the ligand
      + 0.15 · conservation    # how far from wild-type
      + 0.15 · local_fitness   # the cheap GA score
      + 0.10 · validation      # MD, Rosetta, assay anchors
```

Our best candidate reached a pLDDT of 76.1 and an ipTM of 0.62. In context: that
is a confidently folded receptor with a plausible but not certain interface. It is
a starting point for experiments, not a result.

## Conclusion and future work

The pipeline does what it set out to do in a weekend: it turns an intractable
combinatorial design problem into roughly 95 structure-prediction calls, and it
returns a ranked shortlist of SSTR2-cpGFP constructs with a confidently folded
receptor and a plausible ligand interface. The general lesson transfers beyond
biosensors. When your only trustworthy scorer is expensive, the design of the
cheap scorer that feeds it is the whole game.

Three directions I want to take this further:

- **Validate the cheap scorers against the expensive ones.** The genetic
  algorithm assumes the local proxies correlate with pLDDT, and that assumption
  is untested. A scatter plot of local fitness against pLDDT across the 50 folded
  candidates would show whether the search was converging on real signal or
  drifting.
- **Reallocate the API budget.** Fifty ESMFold calls on a single converged
  population may buy less than twenty-five calls across two independent runs
  seeded differently. Diversity in the candidate pool is probably worth more than
  depth in one basin.
- **Predict the property that actually matters.** Every score here is a proxy for
  structural plausibility. None of them predict the *change* in fluorescence
  between the bound and unbound states, which is what makes a biosensor useful.
  Closing that gap, probably by folding both states and scoring the difference,
  is the problem I find most interesting.
