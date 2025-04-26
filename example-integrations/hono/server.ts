import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { L } from "liminal"
import { PORT } from "./constants.ts"
import runic from "./runic.ts"

export const app = new Hono().get("/sse", (c) => {
  return streamSSE(c, async (stream) => {
    const ctl = new AbortController()
    stream.onAbort(() => {
      ctl.abort()
    })
    await L.strand(runic, {
      handler(event) {
        if (event.type === "inferred") {
          stream.writeSSE({ data: event.inference })
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
