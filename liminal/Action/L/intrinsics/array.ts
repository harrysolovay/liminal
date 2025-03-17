import { declare } from "../declare.js"
import type { L } from "../L.js"

export function array<I, O>(elementType: L<I, O>): L<Array<I>, Array<O>> {
  return declare(() => array<I, O>, [elementType])
}
