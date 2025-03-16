import type { L } from "../L.ts"
import { array } from "./array.ts"
import { boolean } from "./boolean.ts"
import { integer } from "./integer.ts"
import { string } from "./string.ts"
import { struct } from "./struct.ts"
import { Memo } from "../../../util/Memo.ts"

export type Intrinsics = ReturnType<typeof getIntrinsics>

export const getIntrinsics = Memo(() => ({
  boolean,
  integer,
  string,
  struct,
  array,
}))

export const getIntrinsicLookup = Memo(
  () =>
    new Map(
      Object.entries(getIntrinsics()).map((entry) => entry.reverse() as [L | ((...args: any) => L), keyof Intrinsics]),
    ),
)
