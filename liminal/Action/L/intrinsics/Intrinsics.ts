import type { L } from "../L.ts"
import { boolean } from "./boolean.ts"
import { integer } from "./integer.ts"
import { string } from "./string.ts"
import { struct } from "./struct.ts"

export type Intrinsics = ReturnType<typeof getIntrinsics>

export function getIntrinsics() {
  return {
    boolean,
    integer,
    string,
    struct,
  }
}

export function getIntrinsicLookup() {
  return new Map(
    Object.entries(getIntrinsics()).map((entry) => entry.reverse() as [L | ((...args: any) => L), keyof Intrinsics]),
  )
}
