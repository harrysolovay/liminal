import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Falsy } from "../../util/Falsy.js"
import type { LMembers } from "./LMembers.js"

export { struct as L } from "./intrinsics/struct.js"

export interface L<I = any, O = I> extends LMembers<I, O>, StandardSchemaV1<I, O> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...values: Array<Falsy | string>): this
}

// TODO: use these to minimize signature in cases where I/O is the same
export type I = typeof I
export declare const I: unique symbol
