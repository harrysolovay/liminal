import type { StandardSchemaV1 } from "@standard-schema/spec"
import { type LType, toJSONSchema } from "liminal-schema"
import type { json } from "liminal-util"
import { LiminalAssertionError } from "liminal-util"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { _infer } from "./_infer.ts"
import { _message } from "./_message.ts"
import { rune } from "./rune.ts"

export interface assistant extends Iterable<Rune<LEvent>, string> {
  <T>(schema: LType<T>): Generator<Rune<LEvent>, T>
}

export const assistant: assistant = Object.assign(
  function*<T>(type: LType<T>): Generator<Rune<LEvent>, T> {
    const schema = toJSONSchema(type)
    const inference = yield* _infer(schema)
    yield* _message("assistant", [{ part: inference }])
    const input = JSON.parse(inference)
    const result = yield* rune(() => (type as StandardSchemaV1<json.ValueObject, T>)["~standard"].validate(input))
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
