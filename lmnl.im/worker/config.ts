import { Config } from "effect"

export const config = Config.all({
  clerkSecret: Config.redacted("CLERK_SECRET"),
  appUrl: Config.string("APP_URL"),
})
