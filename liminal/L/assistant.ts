import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { Schema } from "../Schema.ts"
import { infer } from "./infer.ts"
import { message } from "./message.ts"

export interface assistant extends Iterable<Rune<LEvent>, string> {
  <T>(schema: Schema<T>): Generator<Rune<LEvent>, T>
}

export const assistant: assistant = Object.assign(
  function* assistant<T>(schema: Schema<T>): Generator<Rune<LEvent>, T> {
    const inference = yield* infer(schema)
    yield* message("assistant", [{ part: inference }])
    return JSON.parse(inference)
  },
  {
    *[Symbol.iterator]() {
      const inference = yield* infer()
      yield* message("assistant", [{ part: inference }])
      return inference
    },
  },
)
