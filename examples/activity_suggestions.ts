import { Effect, Schema } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

const Activity = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  location: Schema.String,
  estimatedCostUSD: Schema.Array(Schema.String),
  forWhom: Schema.String,
})

Effect.gen(function*() {
  yield* L.listen(logger)
  yield* L.system`When you are asked a question, answer without asking for clarification.`
  yield* L.user`I'm planning a trip to florida and want a suggestion for a fun activity.`
  let i = 0
  const activities: Array<typeof Activity.Type> = []
  while (i < 5) {
    activities.push(yield* L.assistantSchema(Activity))
    yield* L.user`Another please.`
    i++
  }
}).pipe(
  L.provide(
    L.thread,
  ),
  Effect.scoped,
  Effect.provide(ModelLive),
  Effect.runFork,
)
