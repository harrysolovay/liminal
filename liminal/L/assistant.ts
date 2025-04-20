import type { LSchema } from "liminal-schema"
import { LiminalAssertionError } from "liminal-util"
import type { Rune } from "../Rune.ts"
import { _inference } from "./_inference.ts"
import { _message } from "./_message.ts"

export interface assistant extends Iterable<Rune, string> {
  <T>(schema: LSchema<T>): Generator<Rune, T>
}

export const assistant: assistant = Object.assign(
  function*<T>(schema: LSchema<T>): Generator<Rune, T> {
    const inference = yield* _inference(schema)
    yield* _message("assistant", inference)
    const input = JSON.parse(inference)
    const result = yield (() => schema["~standard"].validate(input))
    if (result.issues) {
      throw new LiminalAssertionError(JSON.stringify(result.issues, null, 2))
    }
    return result.value
  },
  {
    *[Symbol.iterator]() {
      const inference = yield* _inference()
      yield* _message("assistant", inference)
      return inference
    },
  },
)
