import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import footnotePlugin from "markdown-it-footnote"
import { defineConfig, HeadConfig } from "vitepress"
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
  markdown: {
    codeTransformers: [transformerTwoslash()],
    theme: { light: "light-plus", dark: "dracula" },
    config: (md) => md.use(footnotePlugin),
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
        text: "Overview",
        items: [
          { text: "Getting Started", link: "/getting_started" },
          { text: "Why Liminal?", link: "/why" },
          { text: "Examples", link: "/examples" },
        ],
      },
      {
        text: "Concepts",
        base: "/concepts",
        items: [
          { text: "Actions", link: "/actions" },
          { text: "Messages", link: "/messages" },
          { text: "References", link: "/references" },
          { text: "Generation", link: "/generation" },
          { text: "Declarations", link: "/declarations" },
          { text: "Events", link: "/events" },
          { text: "Tools", link: "/tools" },
          { text: "Branches", link: "/branches" },
        ],
      },
      {
        text: "Adapters",
        base: "/adapters",
        items: [
          { text: "AI SDK (Vercel)", link: "/ai_sdk" },
          { text: "Ollama", link: "/ollama" },
        ],
      },
      {
        text: "Error Handling",
        collapsed: true,
        base: "/error_handling",
        items: [
          { text: "Agent Signal", link: "/agent_signal" },
          { text: "Throw & Catch", link: "/throw_catch" },
          { text: "Aborting", link: "/aborting" },
        ],
      },
      {
        text: "Runtime Types",
        base: "/runtime_types",
        link: "/",
        collapsed: true,
        items: [
          { text: "Intrinsics", link: "/intrinsics" },
          { text: "JSON Schema", link: "/json_schema" },
          { text: "Utility Types", link: "/utility_types" },
          { text: "Recursive Types", link: "/recursive_types" },
          { text: "Type Visitors", link: "/type_visitors" },
        ],
      },
      {
        text: "Rationale",
        base: "/rationale",
        collapsed: true,
        items: [
          { text: "Implicit Message Buffers", link: "/implicit_message_buffers" },
          { text: "Decoupling Conversations From Models", link: "/decoupling_conversations_from_models" },
          { text: "Type-safe Observability", link: "/type-safe_observability" },
          { text: "Eliminating Boilerplate", link: "/eliminating_boilerplate" },
          { text: "LLM-first Runtime Types", link: "/llm-first_runtime_types" },
          { text: "Stepping Ability", link: "/stepping_ability" },
        ],
      },
    ],
  },
  transformHead: ({ pageData: { frontmatter }, siteData }) => {
    const head: Array<HeadConfig> = []
    const title = `${frontmatter.title || siteData.title} | ${frontmatter.titleTemplate || "Liminal"}`
    const description = frontmatter.description || siteData.description
    const image = `https://liminal.land${frontmatter.image || "/ogp.png"}`

    head.push(["meta", { property: "og:type", content: "website" }])
    head.push(["meta", { property: "og:title", content: title }])
    head.push(["meta", { property: "og:description", content: description }])
    head.push(["meta", { property: "og:image", content: image }])

    head.push(["meta", { name: "twitter:card", content: "summary_large_image" }])
    head.push(["meta", { name: "twitter:image", content: image }])
    head.push(["meta", { name: "twitter:title", content: title }])
    head.push(["meta", { name: "twitter:description", content: description }])

    return head
  },
})

function code(text: string): string {
  return `<code>${text}</code>`
}
