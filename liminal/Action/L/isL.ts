import type { L } from "./L.js"

export type LTag = typeof LTag
export const LTag: unique symbol = Symbol()

export function isL(value: unknown): value is L {
  return typeof value === "function" && LTag in value
}
