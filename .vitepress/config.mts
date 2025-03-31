import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import footnotePlugin from "markdown-it-footnote"
import { defineConfig, HeadConfig } from "vitepress"
import packageJson from "../liminal/package.json" with { type: "json" }
import { dedent } from "../liminal/util/dedent.ts"

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
  assetsDir: "docs/public",
  ignoreDeadLinks: ["./LICENSE"],
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
  rewrites: (initial) => {
    if (initial.startsWith("docs/")) {
      return initial.slice("docs/".length)
    }
    return ({
      "liminal/Scope/Scope.md": "scope/index.md",
      "liminal/Context/Context.md": "scope/context.md",
      "liminal/Fork/Fork.md": "scope/fork.md",
      "liminal/Action/Action.md": "action/index.md",
      "liminal/DeclareModel/DeclareModel.md": "action/declare-model.md",
      "liminal/Message/Message.md": "action/message.md",
      "liminal/Infer/Infer.md": "action/infer.md",
      "liminal/Embed/Embed.md": "action/embed.md",
      "liminal/EnableTool/EnableTool.md": "action/enable-tool.md",
      "liminal/DisableTool/DisableTool.md": "action/disable-tool.md",
      "liminal/Emit/Emit.md": "action/emit.md",
      "liminal/testing/ActorAssertions.md": "testing/actor-assertions.md",
      "liminal/testing/TestLanguageModel.md": "testing/test-language-model.md",
      "liminal/testing/TestEmbeddingModel.md": "testing/test-embedding-model.md",
      "packages/ai/README.md": "adapters/ai.md",
      "packages/ollama/README.md": "adapters/ollama.md",
    } as Record<string, string>)[initial] ?? (() => {
      console.log("UNMAPPED:", initial)
      return initial
    })()
  },
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
        text: "Scope",
        link: "/",
        base: "/scope",
        items: [
          { text: "Context", link: "/context" },
          { text: "Fork", link: "/fork" },
        ],
      },
      {
        text: "Action",
        base: "/action",
        link: "/",
        items: [
          { text: "DeclareModel", link: "/declare-model" },
          { text: "Message", link: "/message" },
          { text: "Infer", link: "/infer" },
          { text: "Embed", link: "/embed" },
          { text: "EnableTool", link: "/enable-tool" },
          { text: "DisableTool", link: "/disable-tool" },
          { text: "Emit", link: "/emit" },
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
