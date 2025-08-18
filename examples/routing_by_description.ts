import { Prompt } from "@effect/cli"
import { BunContext } from "@effect/platform-bun"
import { Array, Effect, Schema } from "effect"
import L from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* logger

  const [email, name, message] = yield* Prompt.all([
    Prompt.text({ message: "What is your email?" }),
    Prompt.text({ message: "What is your full name?" }),
    Prompt.text({ message: "What would you like help with today?" }),
  ])

  // Append a message describing the request.
  yield* L.user`
    We received the following message from ${name}:

    ${message}
  `

  // Rephrase the customer's message.
  const rephrased = yield* L.branch(
    L.user`What are some other ways of phrasing the customer's request?`,
    L.assistantSchema(Schema.Array(Schema.String)),
  )

  // For each rephrasing, perform a search for relevant context.
  const relevantContext = Effect.all(
    rephrased.map(searchContext(email)),
  ).pipe(
    // Join the retrieved context.
    Effect.map(Array.join("\n\n")),
  )

  // Append a message with that context.
  yield* L.user`
    Here is some potentially relevant context:

    ${relevantContext}
  `

  // Ask the model for the most fitting route.
  const route = yield* L.branch(
    L.user`
      Which of the following descriptions best matches the current conversation?

      - Support
      - Sales
      - Other
    `,
    L.assistantSchema(
      Schema.Literal("support", "sales", "other"),
    ),
  )

  // Route to the subsequent effect.
  yield* { support, sales, other }[route]

  // Mark the fn as the conversation's boundary.
}).pipe(
  L.thread,
  Effect.provide([ModelLive, BunContext.layer]),
  Effect.scoped,
  Effect.runFork,
)

const searchContext = (_email: string) =>
  Effect.fn(function*(_query: string) {
    // Search for similar chunks.
    return "..."
  })

const support = Effect.gen(function*() {
  yield* L.user`...`
  yield* L.assistant
  yield* L.user`...`
  return yield* L.assistant
})

const sales = Effect.gen(function*() {
  yield* L.user`...`
  yield* L.assistant
  yield* L.user`...`
  return yield* L.assistant
})

const other = Effect.gen(function*() {
  yield* L.user`...`
  yield* L.assistant
  yield* L.user`...`
  return yield* L.assistant
})
