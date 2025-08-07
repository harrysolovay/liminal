import { Array, Console, Effect, Schema } from "effect"
import { L, LPretty } from "liminal"

const ExampleSchema = Schema.Struct({
  inner: Schema.String.pipe(
    Schema.annotations({
      description: "Some description for the LLM.",
    }),
  ),
})

Effect.gen(function*() {
  yield* L.userJson({ inner: "value" }, ExampleSchema)
  const message = yield* yield* L.messages.pipe(
    Effect.map(Array.head),
  )
  yield* Console.log(LPretty.message(message))
}).pipe(
  L.strand,
  Effect.runFork,
)
