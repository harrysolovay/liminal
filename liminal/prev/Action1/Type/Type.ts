import type { Falsy } from "../../../util2/Falsy.js"
import type { TypeMembers } from "./TypeMembers.js"

export { object as Type } from "./intrinsics/object.js"

export interface Type<I = any, O = I> extends TypeMembers<I, O> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...values: Array<Falsy | string>): this
}

// TODO: use these to minimize signature in cases where I/O is the same
export type I = typeof I
export declare const I: unique symbol
