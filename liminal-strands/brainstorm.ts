import { type } from "arktype"
import { L, LEvent, type Rune } from "liminal"

export function* brainstorm(seed: string): Generator<Rune<LEvent>, Array<string>> {
  const plan = yield* L.branch(function*() {
    yield* L.system`Brainstorm creative or useful ideas for the provided input.`
    yield* L.user`Here is the input:\n\n${seed}`
    let { ideas } = yield* L.assistant(type({ ideas: "string[]" }))
    return ideas
  })
  return yield* L.branch.all(plan.map(function*(seed) {
    yield* L.system`Elaborate on the brainstormed idea for the provided input.`
    yield* L.user`Here is the input:\n\n${seed}`
    return yield* L.assistant
  }))
}
