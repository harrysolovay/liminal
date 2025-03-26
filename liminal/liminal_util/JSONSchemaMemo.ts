import { toJSONSchema } from "standard-json-schema"
import type { StandardSchemaV1 } from "@standard-schema/spec"

const memo = new WeakMap<StandardSchemaV1, Promise<object>>()

export function JSONSchemaMemo(type: StandardSchemaV1): Promise<object> {
  let pending = memo.get(type)
  if (pending) {
    return pending
  }
  pending = toJSONSchema(type)
  memo.set(type, pending)
  return pending
}
