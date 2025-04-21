import type { SchemaRoot } from "liminal-schema"
import { LiminalAssertionError } from "liminal-util"
import type { Rune } from "../Rune.ts"
import { _infer } from "./_infer.ts"
import { _message } from "./_message.ts"
import { rune } from "./rune.ts"

export interface assistant extends Iterable<Rune<never>, string> {
  <T>(schema: SchemaRoot<T>): Generator<Rune<never>, T>
}

export const assistant: assistant = Object.assign(
  function*<T>(schema: SchemaRoot<T>): Generator<Rune<never>, T> {
    const inference = yield* _infer(schema)
    yield* _message("assistant", [{ part: inference }])
    const input = JSON.parse(inference)
    const result = yield* rune(() => schema["~standard"].validate(input))
    if (result.issues) {
      throw new LiminalAssertionError(JSON.stringify(result.issues, null, 2))
    }
    return result.value
  },
  {
    *[Symbol.iterator]() {
      const inference = yield* _infer()
      yield* _message("assistant", [{ part: inference }])
      return inference
    },
  },
)
