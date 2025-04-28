import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import footnotePlugin from "markdown-it-footnote"
import markdownSteps from "markdown-it-steps"
import { defineConfig, HeadConfig } from "vitepress"
import { llmstxtPlugin } from "vitepress-plugin-llmstxt"
import packageJson from "../../liminal/package.json" with { type: "json" }

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
  description: packageJson.description,
  vite: {
    plugins: [llmstxtPlugin()],
  },
  markdown: {
    codeTransformers: [transformerTwoslash()],
    theme: {
      light: "light-plus",
      dark: "dracula",
    },
    config: (md) => {
      md.use(markdownSteps)
      md.use(footnotePlugin)
    },
  },
  sitemap: { hostname: "http://liminal.land" },
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
    search: { provider: "local" },
    sidebar: [
      {
        text: "llms.txt",
        link: "llms.txt",
        target: "blank",
      },
      {
        text: "Examples",
        link: "https://github.com/harrysolovay/liminal/tree/main/examples",
        target: "blank",
      },
      // {
      //   text: "Contribute",
      //   link: "https://github.com/harrysolovay/liminal/tree/main/CONTRIBUTING.md",
      //   target: "blank",
      // },
      {
        text: "Introduction",
        items: [
          { text: "Why?", link: "/why" },
          { text: "Quickstart", link: "/getting_started" },
          { text: "Strands", link: "/strands" },
        ],
      },
      {
        text: "Conversation",
        items: [
          { text: "Messages", link: "/messages" },
          { text: "Models", link: "/models" },
          { text: "Tools", link: "/tools" },
          { text: "Events", link: "/events" },
          { text: "Schemas", link: "/schemas" },
          // { text: "State", link: "/state" },
          { text: "Testing", link: "/testing" },
        ],
      },
      // {
      //   text: "Types",
      //   base: "/types",
      //   items: [
      //     { text: "Supported Runtime Types", link: "/integrations" },
      //     { text: "LSchema", link: "/lschema" },
      //     {
      //       text: "Type Factories",
      //       collapsed: true,
      //       items: [
      //         { text: "Preface", link: "/preface" },
      //         { text: "Intrinsics", link: "/intrinsics" },
      //         { text: "Utilities", link: "/utilities" },
      //         { text: "Metatype", link: "/metatypes" },
      //         { text: "Transforms", link: "/transforms" },
      //         { text: "Visitation", link: "/visitation" },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   text: "Testing",
      //   collapsed: true,
      //   items: [
      //     { text: "Model Proxy", link: "/model_proxy" },
      //     { text: "Step-debugging", link: "/step_debugging" },
      //   ],
      // },
    ],
  },
  transformHead: ({ pageData: { frontmatter }, siteData }) => {
    const head: Array<HeadConfig> = []
    const title = `${frontmatter.title || siteData.title} | ${frontmatter.titleTemplate || "Liminal"}`
    const description = frontmatter.description || siteData.description
    const image = `https://liminal.land${frontmatter.image || "/ogp.png"}`

    head.push(["meta", { property: "og:type", content: "website" }])
    head.push(["meta", { property: "og:title", content: title }])
    head.push(["meta", { property: "og:image", content: image }])
    head.push(["meta", { property: "og:description", content: description }])

    head.push(["meta", { name: "twitter:title", content: title }])
    head.push(["meta", { name: "twitter:image", content: image }])
    head.push(["meta", { name: "twitter:description", content: description }])
    head.push(["meta", { name: "twitter:card", content: "summary_large_image" }])

    return head
  },
})
