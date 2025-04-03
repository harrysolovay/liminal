import type { StandardSchemaV1 } from "@standard-schema/spec"
import { toJSONSchema } from "standard-json-schema"
import { isType } from "../types/Type.ts"

const memo = new WeakMap<StandardSchemaV1, Promise<object>>()

export function JSONSchemaMemo(type: StandardSchemaV1): Promise<object> {
  let pending = memo.get(type)
  if (pending) {
    return pending
  }
  pending = isType(type) ? Promise.resolve(type.toJSON()) : toJSONSchema(type)
  memo.set(type, pending)
  return pending
}
