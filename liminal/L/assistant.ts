import type { Rune } from "../Rune.ts"
import type { SchemaRoot } from "../Schema/SchemaRoot.ts"
import { LiminalAssertionError } from "../util/LiminalAssertionError.ts"
import { _inference } from "./_inference.ts"
import { _message } from "./_message.ts"
import { rune } from "./rune.ts"

export interface assistant extends Iterable<Rune<never>, string> {
  <T>(schema: SchemaRoot<T>): Generator<Rune<never>, T>
}

export const assistant: assistant = Object.assign(
  function*<T>(schema: SchemaRoot<T>): Generator<Rune<never>, T> {
    const inference = yield* _inference(schema)
    yield* _message("assistant", inference)
    const input = JSON.parse(inference)
    const result = yield* rune(() => schema["~standard"].validate(input))
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
