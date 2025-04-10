import { L } from "liminal"

export default function*() {
  const first = yield* L.section("first")
  yield* L.user`A`
  yield* L.infer
  const g = yield* first("", function*() {
    // Only has messages since `yield* L.section("first")`
    return yield* L.infer
  })
  const m = yield* first.getMessages()
  console.log(g)
  yield* first.clear
}
