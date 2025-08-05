import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client"
import Theme from "vitepress/theme-without-fonts"
import "@shikijs/vitepress-twoslash/style.css"
import type { Theme as ThemeConfig } from "vitepress"
import "./global.css"
import LCompletionsBottomMargin from "../components/LCompletionsBottomMargin.vue"

export default {
  extends: Theme,
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue)
    app.component("LCompletionsBottomMargin", LCompletionsBottomMargin)
  },
} satisfies ThemeConfig
