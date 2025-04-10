import { L } from "liminal"

export default function*() {
  const section = yield* L.section("first")
  yield* L.user`A`
  yield* L.infer
  const g = yield* section("", function*() {
    return yield* L.infer
  })
  yield* section("", function*() {
    // Only has messages since `yield* L.section("first")`
  })
  yield* section.clear
}
