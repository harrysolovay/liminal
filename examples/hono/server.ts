import { openai } from "@ai-sdk/openai"
import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { Exec } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { actor } from "./actor.ts"
import { PORT } from "./constants.ts"

export const app = new Hono().get("/sse", (c) => {
  return streamSSE(c, async (stream) => {
    const ctl = new AbortController()
    stream.onAbort(() => {
      ctl.abort()
    })
    const exec = Exec(actor, {
      default: AILanguageModel(openai("gpt-4o-mini")),
    })
    exec((event) => {
      console.log(event)
      if (event.event.type === "inferred") {
        stream.writeSSE({
          data: event.event.value,
        })
      }
    }, {
      signal: ctl.signal,
    })
    await stream.close()
  })
})

export default {
  port: PORT,
  fetch: app.fetch,
}
