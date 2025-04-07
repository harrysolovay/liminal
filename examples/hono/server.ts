import { openai } from "@ai-sdk/openai"
import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { exec } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { actor } from "./actor.ts"
import { PORT } from "./constants.ts"

export const app = new Hono().get("/sse", (c) => {
  return streamSSE(c, async (stream) => {
    const ctl = new AbortController()
    stream.onAbort(() => {
      ctl.abort()
    })
    await exec(actor, {
      default: AILanguageModel(openai("gpt-4o-mini")),
      args: {},
      handler(event) {
        console.log(event)
        if (event.type === "inferred") {
          stream.writeSSE({
            data: event.value,
          })
        }
      },
      signal: ctl.signal,
    })
    await stream.close()
  })
})

export default {
  port: PORT,
  fetch: app.fetch,
}
