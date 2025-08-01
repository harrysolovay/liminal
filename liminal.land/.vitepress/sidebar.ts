import type { DefaultTheme } from "vitepress/theme"

export const sidebar: DefaultTheme.Sidebar = [
  {
    text: "llms.txt",
    link: "llms-full.txt",
    target: "blank",
  },
  {
    text: "Examples",
    link: "https://github.com/harrysolovay/liminal/tree/main/examples",
    target: "blank",
  },
  {
    text: "Introduction",
    items: [
      { text: "Overview", link: "/overview" },
      { text: "Quickstart", link: "/start" },
      { text: "Testing", link: "/testing" },
    ],
  },
  {
    text: "Concepts",
    items: [
      { text: "Effects", link: "/effects" },
      { text: "Strands", link: "/strands" },
    ],
  },
  {
    text: "Conversation",
    items: [
      { text: "Messages", link: "/message" },
      { text: "Events", link: "/events" },
      { text: "Tools", link: "/tools" },
      { text: "Reduction", link: "/reduction" },
    ],
  },
  {
    text: "Guides",
    base: "/guides",
    items: [
      { text: "Documentation QA", link: "/documentation-qa" },
      { text: "Routing", link: "/routing" },
      { text: "Arbiter", link: "/arbiter" },
      { text: "Iterative Refinement", link: "/iterative-refinement" },
      { text: "Summarize", link: "/summarize" },
      { text: "File-editing", link: "/file-editing" },
    ],
  },
]
