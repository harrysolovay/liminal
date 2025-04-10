import { L } from "liminal"

export default function*() {
  yield* L.user`Lorem.`
  yield* L.user`Ipsum.`
  yield* L.infer
  const before = yield* L.messages
  yield* L.setMessages((_messages) => [])
  const after = yield* L.messages
  return { before, after }
}
