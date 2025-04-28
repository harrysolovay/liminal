import { type } from "arktype"
import { L, type Rune } from "liminal"

export function* brainstorm(seed: string): Generator<Rune, Array<string>> {
  const plan = yield* L.strand(function*() {
    yield* L.system`Brainstorm creative or useful ideas for the provided input.`
    yield* L.user`Here is the input:\n\n${seed}`
    let { ideas } = yield* L.assistant(type({ ideas: "string[]" }))
    return ideas
  })
  return yield* L.strand(plan.map(function*(seed) {
    yield* L.system`Elaborate on the brainstormed idea for the provided input.`
    yield* L.user`Here is the input:\n\n${seed}`
    return yield* L.assistant
  }))
}
