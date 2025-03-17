import { declare } from "../declare.js"
import type { L } from "../L.js"

// TODO: allow struct fields as element type
export function array<I, O>(elementType: L<I, O>): L<Array<I>, Array<O>> {
  return declare(() => array<I, O>, [elementType])
}
