import { type LType, toJSONSchema, validate } from "liminal-schema"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { _infer } from "./_infer.ts"
import { _message } from "./_message.ts"
import { rune } from "./rune.ts"

export interface assistant extends Iterable<Rune<LEvent>, string> {
  <T>(type: LType<T>): Generator<Rune<LEvent>, T>
}

export const assistant: assistant = Object.assign(
  function*<T>(type: LType<T>): Generator<Rune<LEvent>, T> {
    const schema = toJSONSchema(type)
    const inference = yield* _infer(schema)
    yield* _message("assistant", [{ part: inference }])
    const input = JSON.parse(inference)
    return yield* rune(() => validate(type, input), "validate_assistant_message")
  },
  {
    *[Symbol.iterator]() {
      const inference = yield* _infer()
      yield* _message("assistant", [{ part: inference }])
      return inference
    },
  },
)
