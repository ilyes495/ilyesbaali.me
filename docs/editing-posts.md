# Editing blog posts in the browser

The site ships a content editor at `/admin`. It reads and writes the same
markdown files in `src/content/BlogPosts/`, so nothing about the build changes:
saving is a commit, and the commit triggers a deploy.

## Locally (no accounts, recommended for editing)

    export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
    npm run dev

Open <http://localhost:4321/admin/> and choose **Work with Local Repository**,
then pick this project's folder when the browser asks. Edits save directly to
disk; commit them with git when you are happy. Needs a Chromium-based browser
(Chrome, Edge, Arc), since it uses the File System Access API.

## From the live site

Open <https://ilyesbaali.me/admin/> and choose **Sign In Using Access Token**,
then paste a GitHub personal access token with `repo` scope. Saving commits to
`main` and the site redeploys a few minutes later.

For a one-click "Sign in with GitHub" button instead of pasting a token, register
a GitHub OAuth app and deploy the Sveltia CMS Authenticator to Cloudflare
Workers, then set `base_url` in `public/admin/config.yml`.

## What the editor is good for

Prose edits, fixing typos, retitling, changing tags and dates, reordering
sections, and writing short posts. It is a markdown editor with a rich-text
mode, not a Notion block editor.

## What it will not do

Generate figures. The figures are SVGs produced by scripts from real data and
committed alongside the markdown. The editor can upload and insert an existing
image, but authoring one is still a job for the figure pipeline.

Two conventions the editor does not enforce, so keep them in mind when adding
figures by hand:

- Reference figures as `./name.svg` — same folder as the markdown.
- Every standalone SVG needs `xmlns="http://www.w3.org/2000/svg"` on its root
  element, or it will not render through an `<img>` tag.

Math works: `$inline$` and `$$display$$` are rendered by KaTeX at build time.
