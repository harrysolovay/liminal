import type { DefaultTheme } from "vitepress/theme"

export const sidebar: DefaultTheme.Sidebar = [
  // {
  //   text: "llms.txt",
  //   link: "llms-full.txt",
  //   target: "blank",
  // },
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
      { text: "Strands", link: "/strands" },
    ],
  },
  {
    text: "Conversation",
    items: [
      { text: "Messages", link: "/messages" },
      { text: "Tools", link: "/tools" },
      { text: "Streaming", link: "/streaming" },
      { text: "Events", link: "/events" },
    ],
  },
]
