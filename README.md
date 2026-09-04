# ilyesbaali.me

Personal academic site built with [Astro](https://astro.build), based on the
[astro_academia](https://github.com/maiobarbero/astro_academia) template.

## Local development

This project needs Node 20+ (the system Node on this machine is 19, which Astro rejects):

    export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
    npm install
    npm run dev      # http://localhost:4321
    npm run build    # output in dist/
    npm run preview  # serve the built site

## Where the content lives

| What | File |
| --- | --- |
| Name, bio, institute, research areas, social links, SEO | `src/settings.ts` |
| Experience, education, skills, publications | `src/data/cv.ts` |
| Research page prose and selected projects | `src/pages/research.astro` |
| Blog posts (optional, hidden while empty) | `src/content/BlogPosts/*.md` |
| Profile photo | `src/assets/profile_pictures.jpg` |
| CV PDF served at /pdf/ | `public/pdf/Ilyes_Baali_CV.pdf` |

## Deployment

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`.
Set the repository's Pages source to "GitHub Actions".
