import { LiminalAssertionError } from "../LiminalAssertionError.ts"
import type { SchemaObject } from "./Schema.ts"
import { validateSchemaRoot } from "./validate.ts"

export interface LTypes<_T> {}
export type LType<T = any> = [LTypes<T>[keyof LTypes<T>]][0]

export interface LTypeAdapter<T = any, X extends LType<T> = LType<T>> {
  test(value: unknown): boolean
  schema(type: X): object
  validate(type: X, value: unknown): T | Promise<T>
}

const adapters = new Set<LTypeAdapter>()
export function register<T, X extends LType<T>>(adapter: LTypeAdapter<T, X>) {
  adapters.add(adapter)
}

export function adapter(type: LType): LTypeAdapter {
  for (const adapter of adapters) {
    if (adapter.test(type)) {
      return adapter
    }
  }
  LiminalAssertionError.unreachable()
}

const schemaMemo = new WeakMap<LType, SchemaObject>()
export function toJSONSchema<X extends LType>(type: X): SchemaObject {
  let schema = schemaMemo.get(type)
  if (!schema) {
    schema = validateSchemaRoot(adapter(type).schema(type))
    schemaMemo.set(type, schema)
  }
  return schema
}

export function validate<T>(type: LType<T>, value: unknown): T | Promise<T> {
  return adapter(type).validate(type, value)
}
