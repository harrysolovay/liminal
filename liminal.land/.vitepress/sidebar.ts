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
    ],
  },
  {
    text: "Concepts",
    items: [
      { text: "Effects", link: "/effects" },
      { text: "Threads", link: "/threads" },
    ],
  },
  {
    text: "Conversation",
    items: [
      { text: "Messages", link: "/messages" },
      { text: "Envelopes", link: "/Envelopes" },
      { text: "Digests", link: "/Digests" },
      { text: "Persistence", link: "/Persistence" },
      { text: "Events", link: "/events" },
    ],
  },
  {
    text: "Advanced",
    items: [
      { text: "Tools", link: "/tools" },
      { text: "Streaming", link: "/streaming" },
    ],
  },
  {
    text: "Patterns",
    base: "/patterns",
    items: [
      { text: "Routing", link: "/route" },
      { text: "Model Amalgamation", link: "/model" },
    ],
  },
]
