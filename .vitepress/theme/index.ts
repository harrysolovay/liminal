import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client"
import Theme from "vitepress/theme-without-fonts"
import "@shikijs/vitepress-twoslash/style.css"
import type { Theme as ThemeConfig } from "vitepress"
import "./global.css"

export default {
  extends: Theme,
  enhanceApp(ctx) {
    ctx.app.use(TwoslashFloatingVue)
  },
} satisfies ThemeConfig
