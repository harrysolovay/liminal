import { type LType, toJSONSchema, validate } from "liminal-schema"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { continuation } from "./continuation.ts"
import { infer } from "./infer.ts"
import { message } from "./message.ts"

export interface assistant extends Iterable<Rune<LEvent>, string> {
  <T>(type: LType<T>): Generator<Rune<LEvent>, T>
}

export const assistant: assistant = Object.assign(
  function* assistant<T>(type: LType<T>): Generator<Rune<LEvent>, T> {
    const schema = toJSONSchema(type)
    const inference = yield* infer(schema)
    yield* message("assistant", [{ part: inference }])
    const input = JSON.parse(inference)
    return yield* continuation(() => validate(type, input), "validate_assistant_message")
  },
  {
    *[Symbol.iterator]() {
      const inference = yield* infer()
      yield* message("assistant", [{ part: inference }])
      return inference
    },
  },
)
