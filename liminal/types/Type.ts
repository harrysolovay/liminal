import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Infer, InferenceRequestedEvent, InferredEvent } from "../actions/Infer.ts"
import type { Falsy } from "../util/Falsy.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { Taggable } from "../util/Taggable.ts"
import type { JSONRootType } from "./JSONRootType.ts"
import type { JSONType } from "./JSONType.ts"
import type { JSONObjectType } from "./object.ts"

export interface Type<T extends JSONValue = JSONValue, J extends JSONType = JSONType>
  extends Taggable<Array<string | Falsy>>, TypeMembers<T, J>
{
  T: T
  J: J

  [Symbol.iterator]: J extends JSONObjectType ? () => Iterator<
      Infer<{
        Entry: never
        Event: InferenceRequestedEvent | InferredEvent<T>
      }>,
      T
    >
    : never
}

export interface TypeMembers<T extends JSONValue, J extends JSONType> extends StandardSchemaV1<T> {
  [TypeKey]: true
  declaration: () => Type<T, J> | ((...args: any) => Type<T, J>)
  args?: Array<any>
  descriptions: Array<string>
  description(): string
  toJSON(): JSONRootType<J>
  assert(value: unknown): T
}

export type TypeKey = typeof TypeKey
export const TypeKey = Symbol.for("Liminal/Type")

export function isType(value: unknown): value is Type {
  return typeof value === "function" && TypeKey in value
}
