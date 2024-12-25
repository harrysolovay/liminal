import * as I from "../intrinsics.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { AnyType, Type } from "../Type.ts"
import { Hydrated } from "./Hydrated.ts"
import { Record } from "./Record.ts"
import { TaggedUnion } from "./TaggedUnion.ts"

const JSONType_: Type<JSONType> = I.transform(
  TaggedUnion({
    null: null,
    boolean: null,
    integer: null,
    number: null,
    string: null,
    array: I.object({
      items: I.f((): AnyType => JSONType_),
    }),
    object: I.transform(Record(I.f((): AnyType => JSONType_)), (properties) => ({
      properties,
      required: Object.keys(properties),
      additionalProperties: false,
    })),
    union: I.object({
      anyOf: I.f(() => JSONType_),
    }),
  }),
  ({ type, value }) => ({
    ...type === "union" ? {} : { type },
    ...value ? value : {},
  }),
) as never

export type MetaType<P extends symbol> = Type<Type<unknown>, P>

export const MetaType: MetaType<never> = I.transform(JSONType_, Hydrated)
