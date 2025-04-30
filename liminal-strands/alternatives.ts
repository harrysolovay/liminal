import { type } from "arktype"
import { L, LEvent, type Rune } from "liminal"
import { compile } from "liminal-arktype"

export function* alternatives(seed: string): Generator<Rune<LEvent>, Array<string>> {
  const plan = yield* L.strand(function*() {
    yield* L.system`Create high-level descriptions of possible alternatives for the provided input.`
    yield* L.user`Here is the input:\n\n${seed}`
    return yield* L.assistant(compile(type.string.array())) // TODO: use tuple
  })
  return yield* L.all(plan.map(function*(seed) {
    yield* L.system`Generate the alternative for the provided input based on the provided description.`
    yield* L.user`The description of the alternative is as follows:\n\n${seed}`
    return yield* L.assistant
  }))
}
