import { type } from "arktype"
import { env as env_ } from "node:process"

export const env = type({
  OPENAI_API_KEY: "string",
  CLOUDFLARE_API_KEY: "string",
  CLOUDFLARE_EMAIL: "string",
  STAGE: "('dev' | 'prod')?",
}).assert(env_)
