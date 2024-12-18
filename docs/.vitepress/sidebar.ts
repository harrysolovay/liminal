import { DefaultTheme } from "vitepress"

export const MANUAL_SIDEBAR: DefaultTheme.SidebarMulti[string] = {
  base: "",
  items: [
    {
      text: "Overview",
      link: "/",
      items: [
        { text: "Getting Started", link: "/getting-started" },
      ],
    },
    {
      text: "Types",
      base: "/types",
      collapsed: false,
      link: "/",
      items: [
        { text: "Intrinsics", link: "/intrinsics" },
        { text: "Utilities", link: "/utilities" },
        { text: "Recursion", link: "/recursion" },
        { text: "Meta", link: "/meta" },
      ],
    },
    {
      text: "Annotations",
      base: "/annotations",
      collapsed: false,
      link: "/",
      items: [
        { text: "Descriptions", link: "/descriptions" },
        { text: "Assertions", link: "/assertions" },
        { text: "Pins", link: "/pins" },
        { text: "Metadata", link: "/metadata" },
      ],
    },
    {
      text: "Providers",
      base: "/providers",
      collapsed: false,
      link: "/",
      items: [
        { text: "OpenAI", link: "/openai" },
        // { text: "xAI", link: "/xai" },
        // { text: "Ollama", link: "/ollama" },
        // { text: "Anthropic", link: "/anthropic" },
        // { text: "Gemini", link: "/gemini" },
      ],
    },
    {
      text: "Libraries",
      base: "/libraries",
      collapsed: false,
      link: "/",
      items: [
        { text: "Type Visitors", link: "/visitors" },
      ],
    },
    {
      text: "Concepts",
      base: "/concepts",
      collapsed: false,
      link: "/",
      items: [
        { text: "Iterative Refinement", link: "/iterative-refinement" },
        { text: "Model-Guided Refinement", link: "/model-guided-refinement" },
      ],
    },
    {
      text: "XYZ",
      base: "/xyz",
      collapsed: false,
      link: "/",
      items: [
        { text: "Conventions", link: "/conventions" },
        { text: "Troubleshooting", link: "/troubleshooting" },
      ],
    },
  ],
}

export const EXAMPLES_SIDEBAR: DefaultTheme.SidebarMulti[string] = {
  base: "",
  items: [
    {
      text: "Example Group A",
      collapsed: false,
      items: [
        { text: "..." },
      ],
    },
  ],
}
