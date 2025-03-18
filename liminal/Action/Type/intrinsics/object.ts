import type { StandardSchemaV1 } from "@standard-schema/spec"
import { declare } from "../declare.js"
import type { Type } from "../Type.js"
import type { Expand } from "../../../util/Expand.js"
import { boolean } from "./boolean.js"
import { integer } from "./integer.js"
import { string } from "./string.js"
import { array } from "./array.js"
import { enum as enum_ } from "./enum.js"

export const object = Object.assign(
  <const S extends ObjectFields, I extends ObjectT<S, "I">, O extends ObjectT<S, "O">>(
    fields: S,
  ): Type<Expand<I>, Expand<O>> => declare(() => object<S, I, O>, [fields]),
  {
    boolean,
    integer,
    string,
    array,
    enum: enum_,
  },
)

export type ObjectFields = TupleFields | RecordFields
export type TupleFields = Array<Type | ObjectFields | string>
export interface RecordFields {
  [key: string]: Type | ObjectFields | string
}

export type ObjectT<S extends ObjectFields, T extends "I" | "O"> = [
  {
    -readonly [K in keyof S]: S[K] extends StandardSchemaV1<infer I, infer O>
      ? { I: I; O: O }[T]
      : S[K] extends ObjectFields
        ? Expand<ObjectT<S[K], T>>
        : S[K] extends string
          ? S[K]
          : never
  },
][0]
