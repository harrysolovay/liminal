import { type } from "arktype"
import { L, LEvent, type Rune } from "liminal"

export function* alternatives(seed: string): Generator<Rune<LEvent>, Array<string>> {
  const plan = yield* L.branch(function*() {
    yield* L.system`Create high-level descriptions of possible alternatives for the provided input.`
    yield* L.user`Here is the input:\n\n${seed}`
    let { alternatives } = yield* L.assistant(type({ alternatives: "string[]" })) // TODO: use tuple
    return alternatives
  })
  return yield* L.branch.all(plan.map(function*(seed) {
    yield* L.system`Generate the alternative for the provided input based on the provided description.`
    yield* L.user`The description of the alternative is as follows:\n\n${seed}`
    return yield* L.assistant
  }))
}
