import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Phantom } from "../liminal_util/Phantom.js"

// TODO: consider renaming to `Completion` + having `Assistant` NOT write to messages.
export function Assistant(): Generator<Assistant<string>, string>
export function Assistant<O>(type: StandardSchemaV1<unknown, O>): Generator<Assistant<O>, O>
export function* Assistant(type?: StandardSchemaV1): Generator<Assistant, unknown> {
  return yield Phantom({
    kind: "Assistant",
    type,
  })
}

export interface Assistant<T = any> extends Phantom<T> {
  kind: "Assistant"
  type: StandardSchemaV1 | undefined
}
