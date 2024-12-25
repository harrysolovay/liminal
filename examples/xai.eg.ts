import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "liminal"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI({
    apiKey: Deno.env.get("XAI_API_KEY"),
    baseURL: "https://api.x.ai/v1",
  }),
}))

$`How are you today?`

const how = await $.value(L.string)

await L.string.assert(how)
