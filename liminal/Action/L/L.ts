import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Falsy } from "../../util/Falsy.ts"
import { LTag, type LMembers } from "./LMembers.ts"

export { struct as L } from "./intrinsics/struct.ts"

export interface L<I = any, O = I> extends LMembers<I, O>, StandardSchemaV1<I, O> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...values: Array<Falsy | string>): this
}

export function isL(value: unknown): value is L {
  return typeof value === "function" && LTag in value
}

// TODO: use these to minimize signature in cases where I/O is the same
export type I = typeof I
export declare const I: unique symbol
