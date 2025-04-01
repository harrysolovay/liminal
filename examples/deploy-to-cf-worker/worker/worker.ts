import { createOpenAI } from "@ai-sdk/openai"
import type { ExportedHandler } from "@cloudflare/workers-types"
import { Exec } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { env } from "liminal-common"
import { Refine } from "./conversation.ts"

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export default {
  async fetch(request) {
    const input = await request.text()
    try {
      const exec = Exec(Refine(input), {
        default: AILanguageModel(openai("gpt-4o")),
        a: AILanguageModel(openai("gpt-4o-mini")),
        b: AILanguageModel(openai("o1-mini")),
        c: AILanguageModel(openai("gpt-3.5-turbo-instruct")),
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
