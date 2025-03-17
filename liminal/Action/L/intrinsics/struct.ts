import type { StandardSchemaV1 } from "@standard-schema/spec"
import { declare } from "../declare.js"
import type { L } from "../L.js"
import type { Expand } from "../../../util/Expand.js"
import { boolean } from "./boolean.js"
import { integer } from "./integer.js"
import { string } from "./string.js"
import { array } from "./array.js"
import { enum as enum_ } from "./enum.js"

export const struct = Object.assign(
  <const S extends StructFields, I extends StructT<S, "I">, O extends StructT<S, "O">>(
    fields: S,
  ): L<Expand<I>, Expand<O>> => declare(() => struct<S, I, O>, [fields]),
  {
    boolean,
    integer,
    string,
    array,
    enum: enum_,
  },
)

export type StructFields = TupleStructFields | RecordStructFields
export type TupleStructFields = Array<L | StructFields | string>
export interface RecordStructFields {
  [key: string]: L | StructFields | string
}

export type StructT<S extends StructFields, T extends "I" | "O"> = {
  -readonly [K in keyof S]: S[K] extends StandardSchemaV1<infer I, infer O>
    ? { I: I; O: O }[T]
    : S[K] extends StructFields
      ? Expand<StructT<S[K], T>>
      : S[K] extends string
        ? S[K]
        : never
}
