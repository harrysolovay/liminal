import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { RuntimeType } from "liminal-schema"
import type { json } from "liminal-util"
import { LiminalAssertionError } from "liminal-util"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { _infer } from "./_infer.ts"
import { _message } from "./_message.ts"
import { rune } from "./rune.ts"

export interface assistant extends Iterable<Rune<LEvent>, string> {
  <S extends RuntimeType>(schema: S): Generator<Rune<LEvent>, StandardSchemaV1.InferOutput<S>>
}

export const assistant: assistant = Object.assign(
  function*<S extends RuntimeType>(schema: S): Generator<Rune<LEvent>, StandardSchemaV1.InferOutput<S>> {
    const inference = yield* _infer(schema)
    yield* _message("assistant", [{ part: inference }])
    const input = JSON.parse(inference)
    const result = yield* rune(() =>
      (schema as StandardSchemaV1<json.ValueObject, StandardSchemaV1.InferOutput<S>>)["~standard"].validate(input)
    )
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
