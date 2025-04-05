import { createOpenAI } from "@ai-sdk/openai"
import type { ExportedHandler } from "@cloudflare/workers-types"
import { exec } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { env } from "liminal-common"
import { refine } from "./conversation.ts"

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export default {
  async fetch(request) {
    const input = await request.text()
    try {
      const { value } = await exec(refine(input), {
        bind: {
          default: AILanguageModel(openai("gpt-4o")),
          a: AILanguageModel(openai("gpt-4o-mini")),
          b: AILanguageModel(openai("o1-mini")),
          c: AILanguageModel(openai("gpt-3.5-turbo-instruct")),
          select: AILanguageModel(openai("gpt-3.5-turbo")),
        },
      })
      return new Response(value)
    } catch (e: unknown) {
      console.error(e)
      return new Response("INTERNAL SERVER ERROR", {
        status: 500,
      })
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
