import { createOpenAI } from "@ai-sdk/openai"
import type { ExportedHandler } from "@cloudflare/workers-types"
import { exec } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { refine } from "./conversation.ts"

export default {
  async fetch(request, env) {
    const openai = createOpenAI({
      // @ts-ignore
      apiKey: env.OPENAI_API_KEY,
    })
    const input = await request.text()
    try {
      const result = await exec(() => refine(input), {
        default: AILanguageModel(openai("gpt-4o")),
        args: {
          a: AILanguageModel(openai("gpt-4o-mini")),
          b: AILanguageModel(openai("o1-mini")),
          c: AILanguageModel(openai("gpt-3.5-turbo-instruct")),
          select: AILanguageModel(openai("gpt-3.5-turbo")),
        },
      })
      return new Response(result)
    } catch (e: unknown) {
      console.error(e)
      return new Response("INTERNAL SERVER ERROR", {
        status: 500,
      })
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
