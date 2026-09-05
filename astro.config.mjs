// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import { template } from "./src/settings";

import sitemap from "@astrojs/sitemap";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
    integrations: [react(), tailwind(), sitemap()],
    site: template.website_url,
    redirects: {
        "/blog": "/blog/1",
    },
    base: template.base,
    markdown: {
        // $...$ and $$...$$ in posts are rendered to HTML at build time by KaTeX,
        // so no math library is shipped to the browser.
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    },
});
