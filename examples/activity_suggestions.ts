import { Effect, Schema } from "effect"
import { L, strand } from "liminal"
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
    activities.push(yield* L.assistant(Activity))
    yield* L.user`Another please.`
    i++
  }
}).pipe(
  strand({
    system: `When you are asked a question, answer without asking for clarification.`,
  }),
  common,
  Effect.runPromise,
)
