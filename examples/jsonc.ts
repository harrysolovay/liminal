import { Array, Console, Effect, Schema } from "effect"
import { L, LPretty } from "liminal"

const ExampleSchema = Schema.Struct({
  inner: Schema.String.pipe(
    Schema.annotations({
      jsonSchema: {
        description: "Some description for the LLM.",
      },
    }),
  ),
})

Effect.gen(function*() {
  yield* L.userJson({ inner: "value" }, ExampleSchema)
  const message = yield* yield* L.messages.pipe(Effect.map(Array.head))
  yield* Console.log(LPretty.message(message))
}).pipe(
  L.strand,
  Effect.runFork,
)

// encodeJsonc(Schema.Struct({
//   a: Schema.Boolean.annotations({
//     description: "The first field description.",
//   }),
//   b: Schema.Int.annotations({
//     description: "LLMs are gonna love this.",
//   }),
//   c: Schema.Any.annotations({
//     description: "Hi gcanti!",
//   }),
//   d: Schema.Union(
//     Schema.String,
//     Schema.Number,
//     Schema.Struct({
//       sup: Schema.Boolean.annotations({
//         description: "SUP THIS IS GONNA BE COOL",
//       }),
//     }),
//   ).annotations({
//     description: "YET ANOTHER",
//   }),
// }))({
//   a: true,
//   b: 101,
//   c: {
//     hi: {
//       there: "SUP",
//     },
//   },
//   d: {
//     sup: true,
//   },
// }).pipe(
//   Effect.runSync,
//   console.log,
// )
