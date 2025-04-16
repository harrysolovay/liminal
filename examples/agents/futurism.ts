import { L } from "liminal"

export default function*() {
  yield* L.system`You are an expert in the domain of technological futurism.`

  yield* L
    .user`Teach me about a hypothetical technology that may come into existence within the century.`

  const technology = yield* L.infer

  yield* L
    .user`In what ways might it transform music, medicine and paleontology?`

  const ways = yield* L.object({
    music: L.array(L.string),
    medicine: L.array(L.string),
    paleontology: L.array(L.string),
  })

  return { technology, ways }
}
