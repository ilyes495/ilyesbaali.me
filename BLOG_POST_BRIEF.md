# Brief for authoring a blog post

You are writing **one markdown file plus its figures**, delivered as a folder.
This brief is self-contained; you do not need access to the site repo.

Everything below marked **MUST** has broken the site at least once. There is a
validator that checks all of it (see the last section) — run it before you hand
anything over.

## 1. What to deliver

A single flat folder containing:

- `<slug>.md` — the post
- `<NN>-<name>.svg` — the figures, same folder, no subdirectories
- nothing else

**MUST NOT** include a `README`, notes file, `.DS_Store`, or anything that is not
the post or a figure. The site loads `**/*.md` from that folder as blog posts, so
a README is parsed as a post and fails the build. Put hand-off notes in the
message body, not in the folder.

**MUST NOT** be written into the site's `dist/` directory. That is build output
and is deleted on every build.

## 2. Frontmatter

```markdown
---
title: "The Virtual Cell Challenge"
date: "2026-09-05"
excerpt: "One or two sentences, plain text, no markdown. Shown on the index card."
tags: ["Machine learning", "Single cell", "Benchmarks"]
---
```

- `date` **MUST** be a quoted `YYYY-MM-DD` string. Unquoted dates parse as a
  different type and fail validation. It renders in UTC.
- `tags` **MUST** have at least one entry. The first becomes the index badge.
- Title: short and plain, two to four words. No subtitle after a colon.
- The body **MUST NOT** contain an H1. The title comes from frontmatter.

## 3. Structure

- `##` for sections, `###` for subsections. These build the sidebar table of
  contents, so keep headings short and scannable.
- 6–14 `##` sections.
- The last section **MUST** be `## Conclusion and future work`: a short paragraph
  on what the work achieved, then 2–4 bullets on next steps.
- A heading that poses a question takes a colon, not a comma:
  `### 3. Fold-change accuracy: are the sizes right?`

## 4. House style

- **MUST NOT** use em dashes (`—`) anywhere in prose. This has been asked for
  three times and delivered wrong three times. Choose deliberately:
  - introducing an appositive or aside → comma
    *"a short guide RNA, a piece of RNA whose sequence matches the target"*
  - joining two independent clauses → colon or full stop, never a comma
    *"a knockdown does not change one number: it shifts the whole row"*
  - a genuine parenthetical → parentheses
- En dashes (`–`) are fine and correct in numeric ranges: `10–30%`, `2559–2575`.
- First person singular. The author is Ilyes Baali, a computational biologist
  (PhD, Weill Cornell / MSKCC) working on machine learning for RNA biology.
- **MUST NOT** invent results, ranks, scores, or anecdotes. If a fact was not
  supplied, leave `<!-- TODO: ... -->` and say so in the hand-off.
- Explain *why* a choice was made, not only what it was. Define jargon from
  whichever side the reader is unlikely to know.
- No emoji. No horizontal rules between sections.

## 5. Figures

SVG files referenced as `./NN-name.svg`. They are served as standalone images,
**not** inlined into the HTML. That has three consequences:

- Each file **MUST** carry `xmlns="http://www.w3.org/2000/svg"` on the root
  `<svg>`. Without it the browser silently refuses to decode the file and the
  figure is blank, while the request still returns 200. This has been the single
  most repeated defect.
- `currentColor` **cannot** inherit the page's theme through an `<img>`. If the
  ink is dark, paint an explicit light background rect so it stays legible in
  dark mode, or accept that the site puts the figure on a white card.
- **SHOULD NOT** set `style="max-width:…"` on the root `<svg>`. The site sizes
  figures to its own column; a baked cap makes them render small.

Alt text:

- **MUST** be present and non-empty on every figure.
- **MUST** match what the figure currently draws. When you regenerate a figure,
  regenerate its alt text. Stale numbers have shipped twice: alt text claiming
  "13 percent at 5 CPM" against a figure showing 9, and alt text describing a
  right-hand panel that had been removed.
- Describe what is drawn. The italic line under the image states the takeaway.
  Keep them different so a screen reader does not say the same thing twice.

Renaming or renumbering figures between revisions orphans the old files. If you
renumber, say so explicitly in the hand-off.

## 6. Code and maths

- Fenced blocks with an explicit language (```python, ```javascript, ```text).
  Highlighting is automatic; do not add HTML or inline styles.
- Keep blocks under ~20 lines and comment the line carrying the idea.
- Maths works: `$inline$` and `$$display$$` are rendered by KaTeX at build time.
  Code fences are exempt from maths parsing, so `${...}` in JavaScript is safe.

## 7. Validate before delivering

The site repo ships a checker. Copy `scripts/check-posts.mjs` next to your work,
put your folder at `src/content/BlogPosts/`, and run:

    node scripts/check-posts.mjs

It exits non-zero on: em dashes in prose, missing `xmlns`, missing or malformed
frontmatter, an H1 in the body, empty tags, empty alt text, referenced figures
that do not exist, alt text citing percentages the figure does not show, a README
or `.DS_Store` in the folder, and unexpected file types. Warnings cover baked
`max-width` and theme-blind `currentColor`.

**Deliver only when it reports no failures.**
