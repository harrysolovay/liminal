import { Effect } from "effect"
import { L } from "liminal"

export default Effect.fn(function*(message: string) {
  yield* L.user(message)
  yield* L.user`Please summarize the current conversation.`
  const summary = yield* L.assistant
  return L.user(summary)
})
