import type { JSONType } from "./JSONType.ts"
import type { JSONTypeBase } from "./JSONTypeBase.ts"
import { makeType } from "./makeType.ts"
import type { Type } from "./Type.ts"
import { normalizeTypeLike, type NormalizeTypeLikeJ, type NormalizeTypeLikeT, type TypeLike } from "./TypeLike.ts"

export function array<const F extends TypeLike>(
  element: F,
): Type<Array<NormalizeTypeLikeT<F>>, JSONArrayType<NormalizeTypeLikeJ<F>>> {
  return _array(normalizeTypeLike(element)) as never
}

export function _array(element: Type): Type {
  return makeType(() => _array, [element])
}

export interface JSONArrayType<E extends JSONType = any> extends JSONTypeBase {
  type: "array"
  items: E
}
