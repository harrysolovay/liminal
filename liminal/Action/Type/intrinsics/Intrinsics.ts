import type { Type } from "../Type.js"
import { array } from "./array.js"
import { boolean } from "./boolean.js"
import { integer } from "./integer.js"
import { string } from "./string.js"
import { object } from "./object.js"
import { Memo } from "../../../util/Memo.js"
import { enum as enum_ } from "./enum.js"

export type Intrinsics = ReturnType<typeof getIntrinsics>

export const getIntrinsics = Memo(() => ({
  boolean,
  integer,
  string,
  object,
  array,
  enum: enum_,
}))

export const getIntrinsicLookup = Memo(
  () =>
    new Map(
      Object.entries(getIntrinsics()).map(
        (entry) => entry.reverse() as [Type | ((...args: any) => Type), keyof Intrinsics],
      ),
    ),
)
