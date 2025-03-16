import { declare } from "../declare.ts"
import type { L } from "../L.ts"

export function array<I, O>(elementType: L<I, O>): L<Array<I>, Array<O>> {
  return declare(() => array<I, O>, [elementType])
}
