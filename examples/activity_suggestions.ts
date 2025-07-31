import { Effect, Schema, Stream } from "effect"
import { L, Strand } from "liminal"
import { model } from "./_layers.ts"
import { logLEvent } from "./_logLEvent.ts"

const Activity = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  location: Schema.String,
  estimatedCostUSD: Schema.Array(Schema.String),
  forWhom: Schema.String,
})

Effect.gen(function*() {
  yield* L.events.pipe(
    Stream.runForEach(logLEvent),
    Effect.fork,
  )

  yield* L.user`I'm planning a trip to florida and want a suggestion for a fun activity.`
  let i = 0
  const activities: Array<typeof Activity.Type> = []
  while (i < 5) {
    activities.push(yield* L.assistantStruct(Activity))
    yield* L.user`Another please.`
    i++
  }
}).pipe(
  Effect.provide(
    Strand.new`When you are asked a question, answer without asking for clarification.`,
  ),
  Effect.provide(model),
  Effect.runPromise,
)
