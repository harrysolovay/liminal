import { L } from "liminal"

export default function*() {
  yield* L.user`Lorem.`
  yield* L.user`Ipsum.`
  yield* L.infer()
  const before = yield* L.getMessages()
  yield* L.setMessages((_messages) => [])
  const after = yield* L.getMessages()
  return { before, after }
}
