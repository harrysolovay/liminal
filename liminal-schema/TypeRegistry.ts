import { unreachable } from "liminal-util"
import type { SchemaRoot } from "./SchemaRoot.ts"
import { validateSchemaRoot } from "./validate.ts"

export interface LTypes {}
export type LType = [LTypes[keyof LTypes]][0]

export interface LStatics<_X extends LType> {}
export type LStatic<X extends LType> = LStatics<X>[keyof LStatics<X>]

export interface LTypeAdapter<in X extends LType = LType> {
  test(value: unknown): boolean
  toJSON(type: X): object
  validate(type: X, value: any): LStatic<X> | Promise<LStatic<X>>
}

const adapters = new Set<LTypeAdapter>()
export function register(adapter: LTypeAdapter) {
  adapters.add(adapter)
}

export function adapter(type: LType): LTypeAdapter {
  for (const adapter of adapters) {
    if (adapter.test(type)) {
      return adapter
    }
  }
  unreachable()
}

const schemaMemo = new WeakMap<LType, SchemaRoot>()
export function toJSONSchema<X extends LType>(type: X): SchemaRoot {
  let schema = schemaMemo.get(type)
  if (!schema) {
    schema = validateSchemaRoot(adapter(type).toJSON(type))
    schemaMemo.set(type, schema)
  }
  return schema
}

export function validate<X extends LType>(type: X, value: unknown): LStatic<X> | Promise<LStatic<X>> {
  return adapter(type).validate(type, value)
}
