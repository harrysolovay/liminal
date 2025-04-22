// import { EventSource } from "eventsource"
// import { hc } from "hono/client"
// import { PORT } from "./constants.ts"
// import type { app } from "./server.ts"

// const client = hc<typeof app>(`http://localhost:${PORT}`)

// const events = new EventSource(client.sse.$url())

// events.addEventListener("open", () => {
//   console.log("Dad jokes:")
// })

// events.addEventListener("message", (event) => {
//   console.log(event.data)
// })
