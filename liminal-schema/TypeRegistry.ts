import { unreachable } from "liminal-util"
import type { SchemaRoot } from "./SchemaRoot.ts"
import { validateSchemaRoot } from "./validate.ts"

export interface LTypes {}
export type LType = LTypes[keyof LTypes]

export interface LStatics<_X> {}
export type LStatic<X extends LType> = ReturnType<LStatics<X>[keyof LStatics<X>]>

export type LTypeAdapter<in X = any> = (type: X) => object | undefined

const adapters = new Set<LTypeAdapter>()
export function register(adapter: LTypeAdapter) {
  adapters.add(adapter)
}

const schemaMemo = new WeakMap<LType, SchemaRoot>()
export function toJSONSchema<X extends LType>(type: X): SchemaRoot {
  let schema = schemaMemo.get(type)
  if (schema) {
    return schema
  }
  for (const adapter of adapters) {
    const maybeJSONSchema = adapter(type)
    if (maybeJSONSchema) {
      schema = validateSchemaRoot(maybeJSONSchema)
      schemaMemo.set(type, schema)
      return schema
    }
  }
  unreachable()
}
