import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Phantom } from "../liminal_util/Phantom.js"

export function T(): Generator<T<string>, string>
export function T<O>(type: StandardSchemaV1<unknown, O>): Generator<T<O>, O>
export function* T(type?: StandardSchemaV1): Generator<T, unknown> {
  return yield Phantom({
    kind: "T",
    type,
  })
}

export interface T<O = any> extends Phantom<O> {
  kind: "T"
  type: StandardSchemaV1 | undefined
}
