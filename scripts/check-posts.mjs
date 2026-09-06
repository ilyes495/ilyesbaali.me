#!/usr/bin/env node
// Validates blog posts and their figures before they reach the site.
// Run: npm run check
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname, basename } from 'node:path'

const DIR = 'src/content/BlogPosts'
const problems = []
const warnings = []
const fail = (file, msg) => problems.push(`${file}: ${msg}`)
const warn = (file, msg) => warnings.push(`${file}: ${msg}`)

const entries = readdirSync(DIR)

// --- 1. Nothing but posts and figures may live in the collection folder.
// The loader globs **/*.md, so a stray README is parsed as a post and fails
// schema validation; .DS_Store just pollutes the repo.
for (const name of entries) {
  if (statSync(join(DIR, name)).isDirectory()) continue
  const ext = extname(name).toLowerCase()
  if (name === '.DS_Store') fail(name, 'remove it; macOS metadata does not belong in the repo')
  else if (!['.md', '.svg', '.png', '.jpg', '.jpeg', '.webp'].includes(ext))
    fail(name, `unexpected file type "${ext}" in the content folder`)
  else if (ext === '.md' && /^readme/i.test(name))
    fail(name, 'a README here is loaded as a blog post; keep it in docs/')
}

const posts = entries.filter((f) => extname(f) === '.md' && !/^readme/i.test(f))
const figures = entries.filter((f) => extname(f) === '.svg')

// --- 2. Every standalone SVG needs an xmlns, or it will not decode via <img>.
for (const f of figures) {
  const svg = readFileSync(join(DIR, f), 'utf8')
  if (!/\sxmlns\s*=/.test(svg))
    fail(f, 'missing xmlns="http://www.w3.org/2000/svg" on the root <svg>; it will not render')
  if (/<svg[^>]*style="[^"]*max-width/i.test(svg))
    warn(f, 'root style sets max-width, which caps the figure below the column width')
  if (/currentColor/.test(svg) && !/<rect[^>]*fill="(#fff|#FFF|white)/.test(svg))
    warn(f, 'uses currentColor with no background; as an <img> the ink cannot follow the page theme')
}

const referenced = new Set()

for (const post of posts) {
  const raw = readFileSync(join(DIR, post), 'utf8')

  // --- 3. Frontmatter contract.
  const fm = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!fm) { fail(post, 'missing YAML frontmatter'); continue }
  const head = fm[1]
  const body = raw.slice(fm[0].length)

  const field = (k) => (head.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) || [])[1]
  for (const k of ['title', 'date', 'excerpt', 'tags']) {
    if (!field(k)) fail(post, `frontmatter is missing "${k}"`)
  }
  const date = field('date')
  if (date && !/^["']\d{4}-\d{2}-\d{2}["']$/.test(date.trim()))
    fail(post, `date must be a quoted YYYY-MM-DD string, got ${date.trim()}`)
  const tags = field('tags')
  if (tags && /^\[\s*\]$/.test(tags.trim()))
    fail(post, 'tags must not be empty; the first tag becomes the index badge')
  if (/^#\s/m.test(body)) fail(post, 'body contains an H1; the title comes from frontmatter')

  // --- 4. House style: no em dashes in prose (code fences exempt).
  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
  const em = (prose.match(/—/g) || []).length
  if (em) fail(post, `${em} em dash${em > 1 ? 'es' : ''} in prose; use a comma, colon or full stop`)

  // --- 5. Figures: referenced files must exist, and carry alt text.
  for (const m of body.matchAll(/!\[([^\]]*)\]\((\.\/[^)]+)\)/g)) {
    const [, alt, path] = m
    const file = basename(path)
    referenced.add(file)
    if (!entries.includes(file)) fail(post, `references ${file}, which is not in the folder`)
    if (!alt.trim()) fail(post, `${file} has empty alt text`)

    // Numbers quoted in alt text should appear in the figure, or the alt text
    // has drifted from a regenerated figure. This has bitten us three times.
    if (entries.includes(file) && extname(file) === '.svg') {
      const svgText = readFileSync(join(DIR, file), 'utf8')
        .replace(/<[^>]+>/g, ' ')
      const claimed = [...alt.matchAll(/\b(\d[\d,.]*)\s*(?:percent|%)/gi)].map((x) => x[1])
      const missing = claimed.filter((n) => !svgText.includes(n))
      if (missing.length)
        fail(post, `alt text for ${file} cites ${missing.join(', ')}% which the figure does not show`)
    }
  }
}

// --- 6. Orphan figures waste repo space and usually mean a rename went wrong.
for (const f of figures) if (!referenced.has(f)) warn(f, 'not referenced by any post')

for (const w of warnings) console.log(`  warn  ${w}`)
for (const p of problems) console.log(`  FAIL  ${p}`)
console.log(
  problems.length
    ? `\n${problems.length} problem${problems.length > 1 ? 's' : ''} found.`
    : `\nAll posts pass${warnings.length ? ` (${warnings.length} warning${warnings.length > 1 ? 's' : ''}).` : '.'}`
)
process.exit(problems.length ? 1 : 0)
