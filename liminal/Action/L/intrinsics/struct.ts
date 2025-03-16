import type { StandardSchemaV1 } from "@standard-schema/spec"
import { declare } from "../declare.ts"
import type { L } from "../L.ts"
import type { Expand } from "../../../util/Expand.ts"
import { boolean } from "./boolean.ts"
import { integer } from "./integer.ts"
import { string } from "./string.ts"

export const struct = Object.assign(
  <const S extends StructFields, I extends StructT<S, "I">, O extends StructT<S, "O">>(
    fields: S,
  ): L<Expand<I>, Expand<O>> => declare(() => struct<S, I, O>, [fields]),
  { boolean, integer, string },
)

export type StructFields = TupleStructFields | RecordStructFields
export type TupleStructFields = Array<L | StructFields>
export interface RecordStructFields {
  [key: string]: L | StructFields
}

export type StructT<S extends StructFields, T extends "I" | "O"> = {
  -readonly [K in keyof S]: S[K] extends StandardSchemaV1<infer I, infer O>
    ? { I: I; O: O }[T]
    : S[K] extends StructFields
      ? Expand<StructT<S[K], T>>
      : never
}
