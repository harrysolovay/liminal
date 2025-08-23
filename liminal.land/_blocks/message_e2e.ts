import { Message } from "@effect/ai/AiInput"
import { Effect, pipe, Schema } from "effect"
import { L } from "liminal"

const conversation = Effect.gen(function*() {
  yield* L.user`...`
  yield* L.assistant
  const messages = yield* L.messages

  const encoded = pipe(
    messages,
    Schema.encodeSync(Schema.Array(Message)),
    JSON.stringify,
  )
  encoded satisfies string

  const decoded = pipe(
    encoded,
    JSON.parse,
    Schema.decodeUnknownSync(Schema.Array(Message)),
  )
  decoded satisfies ReadonlyArray<Message>
})
