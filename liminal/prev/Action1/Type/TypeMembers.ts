import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { toJSONSchema } from "./toJSONSchema.js"
import type { TypeTag } from "./isType.js"
import type { TypeLike } from "./TypeLike.js"

export interface TypeMembers<I, O> extends TypeLike<O>, StandardSchemaV1<I, O> {
  [TypeTag]: true
  self: () => this | (() => this)
  args?: Array<unknown>
  descriptions: Array<string>
  toJSONSchema: typeof toJSONSchema
}
