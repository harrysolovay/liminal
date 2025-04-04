import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Falsy } from "../util/Falsy.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { JSONRootType } from "./JSONRootType.ts"
import type { JSONType } from "./JSONType.ts"

export interface Type<T extends JSONValue = JSONValue, J extends JSONType = JSONType> extends TypeMembers<T, J> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...values: Array<Falsy | string>): this

  T: T
  J: J
}

export interface TypeMembers<T extends JSONValue, J extends JSONType> extends StandardSchemaV1<T> {
  [TypeKey]: true
  declaration: () => Type<T, J> | ((...args: any) => Type<T, J>)
  args?: Array<any>
  descriptions: Array<string>
  toJSON(): JSONRootType<J>
}

export const TypeKey = Symbol.for("Liminal/Type")

export function isType(value: unknown): value is Type {
  return typeof value === "function" && TypeKey in value
}
