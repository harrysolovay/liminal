import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import footnotePlugin from "markdown-it-footnote"
import markdownSteps from "markdown-it-steps"
import path from "node:path"
import { defineConfig } from "vitepress"
import llmstext from "vitepress-plugin-llms"
import liminalRootPackageJson from "../../liminal/package.json" with { type: "json" }
import liminalLandPackageJson from "../package.json" with { type: "json" }
import { sidebar } from "./sidebar.ts"

// cspell:disable
const GOOGLE_ANALYTICS = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-0VS5ZGHX74');
`
// cspell:enable

export default defineConfig({
  title: "Liminal",
  description: liminalRootPackageJson.description,
  vite: {
    plugins: [llmstext({
      domain: liminalLandPackageJson.homepage,
    })],
  },
  markdown: {
    codeTransformers: [transformerTwoslash({
      explicitTrigger: false,
      twoslashOptions: {
        vfsRoot: path.resolve(__dirname, "../blocks"),
        compilerOptions: {
          allowImportingTsExtensions: true,
          noEmit: true,
        },
      },
    }) as never],
    theme: {
      light: "light-plus",
      dark: "dracula",
    },
    config: (md) => {
      md.use(markdownSteps)
      md.use(footnotePlugin)
    },
  },
  sitemap: {
    hostname: "http://liminal.land",
  },
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  head: [
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    ["link", {
      rel: "stylesheet",
      href:
        "https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Inconsolata:wght@200..900&display=swap",
    }],
    ["link", { rel: "icon", type: "image/png", href: "/liminal-puzzle.png" }],
    ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-0VS5ZGHX74" }],
    ["script", {}, GOOGLE_ANALYTICS],
  ],
  themeConfig: {
    externalLinkIcon: true,
    editLink: {
      pattern: "https://github.com/harrysolovay/liminal/edit/main/docs/:path",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/harrysolovay/liminal" },
      { icon: "x", link: "https://x.com/harrysolovay" },
    ],
    search: {
      provider: "local",
    },
    sidebar,
  },
  transformHead: ({ pageData: { frontmatter }, siteData }) => {
    const title = `${frontmatter.title || siteData.title} | ${frontmatter.titleTemplate || "Liminal"}`
    const description = frontmatter.description || siteData.description
    const image = `https://liminal.land${frontmatter.image || "/ogp.png"}`
    return [
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:image", content: image }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["meta", { name: "twitter:image", content: image }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ]
  },
})
