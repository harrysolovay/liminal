import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Phantom } from "../liminal_util/Phantom.js"

export function Value(): Generator<Value<string>, string>
export function Value<O>(type: StandardSchemaV1<unknown, O>): Generator<Value<O>, O>
export function* Value(type?: StandardSchemaV1): Generator<Value, unknown> {
  return yield Phantom({
    kind: "Value",
    type,
  })
}

export interface Value<O = any> extends Phantom<O> {
  kind: "Value"
  type: StandardSchemaV1 | undefined
}
