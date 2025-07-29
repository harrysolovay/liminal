import * as Console from "effect/Console"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { L, Strand } from "liminal"
import { common } from "./_common.ts"

const Activity = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  location: Schema.String,
  estimatedCostUSD: Schema.Array(Schema.String),
  forWhom: Schema.String,
})

await Effect.gen(function*() {
  yield* L.user`I'm planning a trip to florida and want a suggestion for a fun activity.`
  let i = 0
  const activities: Array<typeof Activity.Type> = []
  while (i < 5) {
    activities.push(yield* L.assistantStruct(Activity))
    yield* L.user`Another please.`
    i++
  }
}).pipe(
  Effect.provide(Strand.layer({
    system: `When you are asked a question, answer without asking for clarification.`,
    onMessage: Console.log,
  })),
  common,
  Effect.runPromise,
)
