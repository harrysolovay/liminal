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
    lineNumbers: true,
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
        text: "The Awesome List",
        link: "https://raw.githubusercontent.com/harrysolovay/liminal/refs/heads/main/AWESOME.md",
        target: "blank",
      },
      {
        text: "llms.txt",
        link: "https://raw.githubusercontent.com/harrysolovay/liminal/refs/heads/main/llms.txt",
        target: "blank",
      },
      {
        text: "Introduction",
        items: [
          { text: "Getting Started", link: "/getting_started" },
          { text: "Why Liminal?", link: "/why" },
          { text: "Liminal Agents", link: "/agents" },
          { text: "Runtime", link: "/runtime" },
        ],
      },
      {
        text: "Agents",
        items: [
          { text: "Models", link: "/models" },
          { text: "Messages", link: "/messages" },
          { text: "Replies", link: "/replies" },
          { text: "Streams", link: "/streams" },
          { text: "Branches", link: "/branches" },
          { text: "Events", link: "/events" },
          { text: "Tools", link: "/tools" },
        ],
      },
      {
        text: "Reliability",
        items: [
          { text: "Error-recovery", link: "/error-recovery" },
          { text: "Testing", link: "/testing" },
        ],
      },
      {
        text: "Integration",
        base: "/integration",
        collapsed: true,
        items: [
          { text: "Persistence", link: "/persistence" },
          { text: "Websockets", link: "/websockets" },
          { text: "Server-side Events", link: "/server-side_events" },
          { text: "React Hooks", link: "/react_hooks" },
        ],
      },
      {
        text: "Models Adapters",
        base: "/model_adapters",
        collapsed: true,
        items: [
          { text: "Anthropic", link: "/anthropic" },
          { text: "OpenAI", link: "/openai" },
          { text: "xAI", link: "/xai" },
          { text: "ollama", link: "/ollama" },
          { text: "Google Generative AI", link: "/google_gen_ai" },
          { text: "AI SDK", link: "/ai-sdk" },
          { text: "DeepSeek", link: "/deepseek" },
        ],
      },
      {
        text: "Liminal Types",
        base: "/liminal_types",
        collapsed: true,
        items: [
          { text: "Preface", link: "/preface" },
          { text: "Intrinsics", link: "/intrinsics" },
          { text: "Utilities", link: "/utilities" },
          { text: "Metatypes", link: "/metatypes" },
          { text: "Transforms", link: "/transforms" },
          { text: "Visitor API", link: "/visitor_api" },
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
    head.push(["meta", { property: "og:image", content: image }])
    head.push(["meta", { property: "og:description", content: description }])

    head.push(["meta", { name: "twitter:title", content: title }])
    head.push(["meta", { name: "twitter:image", content: image }])
    head.push(["meta", { name: "twitter:description", content: description }])
    head.push(["meta", { name: "twitter:card", content: "summary_large_image" }])

    return head
  },
})
