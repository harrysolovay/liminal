import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import footnotePlugin from "markdown-it-footnote"
import { defineConfig, HeadConfig } from "vitepress"
import packageJson from "../../liminal/package.json" with { type: "json" }
import { dedent } from "../../liminal/util/dedent.js"

// cspell:disable
const GOOGLE_ANALYTICS = dedent`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-0VS5ZGHX74');
`
// cspell:enable

export default defineConfig({
  title: "Liminal",
  description: packageJson.description,
  markdown: {
    codeTransformers: [transformerTwoslash()],
    theme: {
      dark: "github-dark",
      light: "github-light",
    },
    config: (md) => md.use(footnotePlugin),
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
      href: "https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap",
    }],
    ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-0VS5ZGHX74" }],
    ["script", {}, GOOGLE_ANALYTICS],
  ],
  themeConfig: {
    editLink: {
      pattern: "https://github.com/harrysolovay/liminal/edit/main/docs/:path",
    },
    nav: [
      {
        text: "Manual",
        link: "/",
      },
      {
        text: "GitHub",
        link: "https://github.com/harrysolovay/liminal",
        target: "new",
      },
    ],
    search: {
      provider: "local",
    },
    sidebar: [
      {
        text: "Overview",
        link: "/",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          {
            text: "Rationale",
            collapsed: true,
            base: "/rationale",
            items: [
              { text: "Implicit Message Buffer", link: "/implicit_message_buffer" },
              { text: "Decoupling From Models", link: "/decoupling_from_models" },
              { text: "Type-safe Observability", link: "/type-safe_observability" },
              { text: "Eliminating Boilerplate", link: "/eliminating_boilerplate" },
              // { text: "LLM-first Runtime Types", link: "/llm-first_runtime_types" },
            ],
          },
        ],
      },
      {
        text: "Scopes",
        link: "liminal/Scope/Scope",
        items: [
          { text: "Context", link: "liminal/Context/Context" },
          { text: "Branches", link: "liminal/Branches/Branches" },
          { text: "CurrentScope", link: "liminal/CurrentScope/CurrentScope" },
        ],
      },
      {
        text: "Actions",
        base: "/actions",
        items: [
          { text: "Model", link: "liminal/Model/Model" },
          { text: "Message", link: "liminal/Message/Message" },
          { text: "Generation", link: "liminal/Generation/Generation" },
          { text: "Embedding", link: "liminal/Embedding/Embedding" },
          { text: "Tool", link: "liminal/Tool/Tool" },
          { text: "Emission", link: "liminal/Emission/Emission" },
        ],
      },
      // {
      //   text: "Runtime Types",
      //   base: "/runtime-types",
      //   collapsed: true,
      //   link: "/",
      //   items: [
      //     { text: "Descriptions", link: "/descriptions" },
      //     { text: "Intrinsic", link: "/intrinsics" },
      //     { text: "Utility", link: "/utility" },
      //     { text: "Recursion", link: "/recursion" },
      //     { text: "Meta", link: "/meta" },
      //     { text: "Visitor", link: "/visitor" },
      //     { text: "Pins", link: "/pins" },
      //   ],
      // },
      {
        text: "Adapters",
        base: "/adapters",
        collapsed: false,
        link: "/",
        items: [
          { text: "AI SDK (Vercel)", link: "/ai" },
        ],
      },
      {
        text: "Testing",
        base: "/testing",
        collapsed: false,
        link: "/",
        items: [
          { text: "TestEmbeddingModels", link: "/test-embedding-models" },
          { text: "TestLanguageModels", link: "/test-language-models" },
          { text: "AssertionScope", link: "/assertion-scope" },
        ],
      },
    ],
    footer: { // TODO: get this rendering
      message:
        `Released under the <a href="https://github.com/harrysolovay/liminal/blob/main/LICENSE">Apache 2.0 License</a>.`,
      copyright: `Copyright © 2024-present <a href="https://x.com/harrysolovay">Harry Solovay</a>`,
    },
  },
  transformHead: ({ pageData: { frontmatter }, siteData }) => {
    const head: Array<HeadConfig> = []
    const title = `${frontmatter.title || siteData.title} | ${frontmatter.titleTemplate || "Liminal"}`
    const description = frontmatter.description || siteData.description
    const image = `https://liminal.land${frontmatter.image || "/ogp.png"}`
    head.push(["meta", { name: "twitter:card", content: "summary_large_image" }])
    head.push(["meta", { name: "twitter:image", content: image }])
    head.push(["meta", { property: "og:title", content: title }])
    head.push(["meta", { property: "og:description", content: description }])
    head.push(["meta", { property: "og:image", content: image }])
    return head
  },
})
