import { declare } from "../declare.js"
import type { Type } from "../Type.js"
import type { ObjectFields, ObjectT } from "./object.js"

export function array<I, O>(elementType: Type<I, O>): Type<Array<I>, Array<O>>
export function array<const F extends ObjectFields>(
  elementFields: F,
): Type<Array<ObjectT<F, "I">>, Array<ObjectT<F, "O">>>
export function array<I, O>(elementType: Type<I, O>): Type<Array<I>, Array<O>> {
  return declare(() => array<I, O>, [elementType])
}
