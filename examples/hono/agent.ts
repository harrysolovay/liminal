import { L } from "liminal"

export default function*() {
  yield* L.user`Please tell me some goofy dad jokes.`
  let i = 0
  while (i < 10) {
    yield* L.infer()
    i++
  }
}
