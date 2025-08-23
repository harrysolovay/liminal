import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./tables",
  out: "./migrations",
  dialect: "sqlite",
})
