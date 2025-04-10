import { L } from "liminal"

export default function*() {
  yield* L.declareModel("gemma3", "language")
  yield* L.user`Hi Gemma3, how are you today?`
  const response = yield* L.infer
}
