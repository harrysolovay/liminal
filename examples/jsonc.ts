import { Array, Console, Effect, Schema } from "effect"
import { F, L } from "liminal"
import { logger } from "./_logger.ts"

const ExampleSchema = Schema.Struct({
  inner: Schema.String.pipe(
    Schema.annotations({
      description: "Some description for the LLM.",
    }),
  ),
})

Effect.gen(function*() {
  yield* logger
  yield* F.json({ inner: "value" }, ExampleSchema).pipe(
    L.user,
  )
  const message0 = yield* yield* L.messages.pipe(
    Effect.map(Array.head),
  )
  yield* Console.log(message0)
}).pipe(
  L.provide(
    L.thread,
  ),
  Effect.scoped,
  Effect.runFork,
)
