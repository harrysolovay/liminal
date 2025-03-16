import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Complete } from "./Complete.ts"
import type { toJSONSchema } from "./toJSONSchema.ts"

export type LTag = typeof LTag
export const LTag: unique symbol = Symbol()

export interface LMembers<I, O> extends Iterable<Complete<I, O>, O>, StandardSchemaV1<I, O> {
  [LTag]: true
  self: () => this | (() => this)
  args?: Array<unknown>
  descriptions: Array<string>
  toJSONSchema: typeof toJSONSchema
}
