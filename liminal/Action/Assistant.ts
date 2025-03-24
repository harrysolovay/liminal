import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Phantom } from "../liminal_util/Phantom.js"

export function Completion(): Generator<Completion<string>, string>
export function Completion<O>(type: StandardSchemaV1<unknown, O>): Generator<Completion<O>, O>
export function* Completion(type?: StandardSchemaV1): Generator<Completion, unknown> {
  return yield Phantom({
    kind: "Completion",
    type,
  })
}

export interface Completion<T = any> extends Phantom<T> {
  kind: "Completion"
  type: StandardSchemaV1 | undefined
}
