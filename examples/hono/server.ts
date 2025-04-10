import { openai } from "@ai-sdk/openai"
import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { exec } from "liminal"
import { AILanguageModel } from "liminal-ai"
import agent from "./agent.ts"
import { PORT } from "./constants.ts"

export const app = new Hono().get("/sse", (c) => {
  return streamSSE(c, async (stream) => {
    const ctl = new AbortController()
    stream.onAbort(() => {
      ctl.abort()
    })
    await exec(agent, {
      signal: ctl.signal,
      default: AILanguageModel(openai("gpt-4o-mini")),
      handler(event) {
        console.log(event)
        if (event.type === "inferred") {
          const { value } = event
          stream.writeSSE({
            data: typeof value === "string" ? value : JSON.stringify(value, null, 2),
          })
        }
      },
    })
    await stream.close()
  })
})

export default {
  port: PORT,
  fetch: app.fetch,
}
