import { createOpenAI } from "@ai-sdk/openai"
import type { ExportedHandler } from "@cloudflare/workers-types"
import { env } from "cloudflare:workers"
import { Exec } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { Refine } from "./conversation.ts"

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export default {
  async fetch(request) {
    const input = await request.text()
    try {
      const exec = Exec(Refine(input)).models({
        default: AILanguageModel(openai("gpt-4o-mini")),
        a: AILanguageModel(openai("o1-mini")),
        b: AILanguageModel(openai("gpt-3.5-turbo-instruct")),
        c: AILanguageModel(openai("gpt-4o")),
        select: AILanguageModel(openai("gpt-3.5-turbo")),
      })
      const { result } = await exec.exec()
      return new Response(result)
    } catch (e: unknown) {
      console.error(e)
      return new Response("INTERNAL SERVER ERROR", {
        status: 500,
      })
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
