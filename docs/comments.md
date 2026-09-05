# Comments

Comments are [giscus](https://giscus.app): each post's thread is a GitHub
Discussion in your own repository. Visitors sign in with GitHub, so there is no
account system, no database, and no moderation queue to host. You moderate from
the repository's Discussions tab, and every comment is deletable there.

The component is already wired into blog posts and renders **nothing** until the
four values below are filled in, so the site is safe to deploy meanwhile.

## Turning it on

These steps need a repository that exists on GitHub and is public. The Astro
project has not been pushed yet, so do that first.

1. **Enable Discussions** on the repository:
   Settings → General → Features → tick *Discussions*.
   Or: `gh api -X PATCH repos/OWNER/REPO -f has_discussions=true`

2. **Create a category** for the threads:
   Discussions → Categories → New category. Name it `Comments` and set the
   format to **Announcement**, so only you can start threads and giscus
   attaches comments to the right one.

3. **Install the giscus app** on the repository:
   <https://github.com/apps/giscus> → Install → select just this repository.

4. **Get the two IDs** from <https://giscus.app>: enter the repository, pick the
   `Comments` category, and copy `data-repo-id` and `data-category-id` from the
   snippet it generates.

5. **Fill in `src/settings.ts`**:

   ```ts
   export const comments = {
     enabled: true,
     repo: 'ilyes495/ilyesbaali.me',
     repoId: 'R_kgD...',
     category: 'Comments',
     categoryId: 'DIC_kwD...',
   }
   ```

Rebuild and the comment box appears at the foot of every post.

## How it behaves

- Threads are matched to posts by **pathname**, so a post keeps its comments as
  long as its slug does not change. Renaming a post's file orphans its thread.
- The widget follows the site's light/dark toggle: a small script pushes the
  current theme into the giscus iframe whenever you switch.
- It loads lazily, so it costs nothing until a reader scrolls to it.
- Reactions are on. The comment box sits above the thread.

## Things worth knowing before turning it on

- **The repository must be public.** A private repository cannot host public
  comments, since readers need to see the Discussion.
- **Commenting requires a GitHub account**, which is a real filter on who will
  bother. For a technical blog that is usually acceptable and keeps spam near
  zero; for a general audience it is a barrier.
- Comments live in your repository, not on a third-party service, so they are
  yours and exportable. The tradeoff is that giscus's JavaScript is loaded from
  `giscus.app` at read time.
