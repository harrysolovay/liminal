import type { Type } from "./Type.js"

export type TypeTag = typeof TypeTag
export const TypeTag: unique symbol = Symbol()

export function isType(value: unknown): value is Type {
  return typeof value === "function" && TypeTag in value
}
