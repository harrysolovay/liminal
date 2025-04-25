import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { Agent } from "liminal"
import { PORT } from "./constants.ts"
import runic from "./runic.ts"

export const app = new Hono().get("/sse", (c) => {
  return streamSSE(c, async (stream) => {
    const ctl = new AbortController()
    stream.onAbort(() => {
      ctl.abort()
    })
    await Agent(runic, {
      signal: ctl.signal,
      handler(event) {
        if (event.type === "inferred") {
          stream.writeSSE({ data: event.inference })
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
