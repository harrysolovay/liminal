import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Complete } from "./Complete.js"
import type { toJSONSchema } from "./toJSONSchema.js"
import type { TypeTag } from "./isType.js"

export interface TypeMembers<I, O> extends Iterable<Complete<I, O>, O>, StandardSchemaV1<I, O> {
  [TypeTag]: true
  self: () => this | (() => this)
  args?: Array<unknown>
  descriptions: Array<string>
  toJSONSchema: typeof toJSONSchema
}
