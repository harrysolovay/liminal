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
          { text: "Lifecycle", link: "/lifecycle.md" },
          {
            text: "Rationale",
            base: "/rationale",
            collapsed: true,
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
        text: "Actors",
        link: "/actors",
        items: [
          { text: "Messages", link: "/messages.md" },
          { text: "Actions", link: "/actions.md" },
          { text: "Requirements", link: "/requirements.md" },
          { text: "Scopes", link: "/scopes.md" },
          { text: "Events", link: "/events.md" },
        ],
      },
      {
        text: "Actions",
        link: "/actions",
        items: [
          { text: `${code("system")} | ${code("user")}`, link: "" },
          { text: code("infer"), link: "/infer" },
          { text: "embed", link: "/embed" },
          { text: `${code("enableTool")} | ${code("disableTool")}`, link: "/enable-tool" },
          { text: code("emit"), link: "/emit" },
          { text: code("abort"), link: "/emit" },
        ],
      },
      {
        text: "Executors",
        link: "/executors.md",
        items: [
          { text: "Event Handling", link: "/event_handling.md" },
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
        text: "Model Adapters",
        base: "/model_adapters",
        collapsed: true,
        link: "/",
        items: [
          { text: "AI SDK (Vercel)", link: "/ai" },
          { text: "Ollama", link: "/ollama" },
        ],
      },
      // {
      //   text: "Testing",
      //   base: "/testing",
      //   collapsed: false,
      //   items: [
      //     { text: "ActorAssertions", link: "/actor-assertions" },
      //     { text: "TestLanguageModel", link: "/test-language-model" },
      //     { text: "TestEmbeddingModel", link: "/test-embedding-model" },
      //   ],
      // },
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

function code(text: string): string {
  return `<code>${text}</code>`
}
