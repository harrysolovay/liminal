import type { Schema, SchemaAnyOf } from "../../Schema.ts"
import { make } from "./_schema_common.ts"

export interface anyOf<XA extends Array<Schema> = Array<Schema>> extends SchemaAnyOf<XA[number]["T"]> {
  anyOf: XA
}

export function anyOf<XA extends Array<Schema>>(anyOf: XA): anyOf<XA> {
  return make({ anyOf })
}
