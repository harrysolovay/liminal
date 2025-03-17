import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Complete } from "./Complete.js"
import type { toJSONSchema } from "./toJSONSchema.js"
import type { LTag } from "./isL.js"

export interface LMembers<I, O> extends Iterable<Complete<I, O>, O>, StandardSchemaV1<I, O> {
  [LTag]: true
  self: () => this | (() => this)
  args?: Array<unknown>
  descriptions: Array<string>
  toJSONSchema: typeof toJSONSchema
}
