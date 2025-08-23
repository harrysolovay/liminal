import { Array, Console, Effect, Schema } from "effect"
import { F, L, LPretty } from "liminal"

const ExampleSchema = Schema.Struct({
  inner: Schema.String.pipe(
    Schema.annotations({
      description: "Some description for the LLM.",
    }),
  ),
})

Effect.gen(function*() {
  yield* F.json({ inner: "value" }, ExampleSchema).pipe(
    L.user,
  )
  const message = yield* yield* L.messages.pipe(
    Effect.map(Array.head),
  )
  yield* Console.log(LPretty.message(message))
}).pipe(
  L.thread,
  Effect.runFork,
)
