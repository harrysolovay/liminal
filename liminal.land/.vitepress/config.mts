import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import { _util } from "liminal"
import footnotePlugin from "markdown-it-footnote"
import { defineConfig, HeadConfig } from "vitepress"
import packageJson from "../../liminal/package.json" with { type: "json" }

// cspell:disable
const GOOGLE_ANALYTICS = _util.dedent`
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
          { text: "Getting Started", link: "/getting_started" },
          {
            text: "Rationale",
            base: "/rationale",
            items: [
              { text: "Implicit Message Buffers", link: "/implicit_message_buffers" },
              { text: "Decoupling Conversations From Models", link: "/decoupling_conversations_from_models" },
              { text: "Type-safe Observability", link: "/type-safe_observability" },
              { text: "Eliminating Boilerplate", link: "/eliminating_boilerplate" },
              // { text: "LLM-first Runtime Types", link: "/llm-first_runtime_types" },
            ],
          },
        ],
      },
      {
        text: "Actions",
        base: "/action",
        link: "/",
        items: [
          { text: "Model Declaration", link: "/declare-model" },
          { text: "Messages", link: "/message" },
          { text: "Inference", link: "/infer" },
          { text: "Embedding", link: "/embed" },
          { text: "Tool Calling", link: "/enable-tool" },
          { text: "Custom Events", link: "/emit" },
        ],
      },
      {
        text: "Scope",
        link: "/",
        base: "/scope",
        items: [
          { text: "Contexts", link: "/context" },
          { text: "Forks", link: "/fork" },
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
          { text: "Ollama", link: "/ollama" },
        ],
      },
      {
        text: "Testing",
        base: "/testing",
        collapsed: false,
        items: [
          { text: "ActorAssertions", link: "/actor-assertions" },
          { text: "TestLanguageModel", link: "/test-language-model" },
          { text: "TestEmbeddingModel", link: "/test-embedding-model" },
        ],
      },
    ],
    footer: {
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
