import type { StandardSchemaV1 } from "@standard-schema/spec"
import { unreachable } from "liminal-util"
import type { SchemaRoot } from "./SchemaRoot"
import { validateSchemaRoot } from "./validate.ts"

export interface SchemaAdapterRegistry {}

export type RuntimeType = [SchemaAdapterRegistry[keyof SchemaAdapterRegistry]][0]

export interface SchemaAdapter<in T extends StandardSchemaV1 = any> {
  match: (type: T) => boolean
  toJSON: (type: T) => object
}

const registry = new Set<SchemaAdapter>()

export function register<T extends RuntimeType>(adapter: SchemaAdapter<T>) {
  registry.add(adapter)
}

const memo = new Map<RuntimeType, SchemaRoot>()

export function toJSONSchema<T extends RuntimeType>(type: T): SchemaRoot {
  let schema = memo.get(type)
  if (schema) {
    return schema
  }
  for (const adapter of registry) {
    if (adapter.match(type)) {
      schema = validateSchemaRoot(adapter.toJSON(type))
      memo.set(type, schema)
      return schema
    }
  }
  unreachable()
}
