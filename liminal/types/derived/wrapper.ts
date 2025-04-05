import { type JSONObjectType, object } from "../object.ts"
import type { Type } from "../Type.ts"
import type { NormalizeTypeLikeJ, NormalizeTypeLikeT, TypeLike } from "../TypeLike.ts"

export function wrapper<X extends TypeLike>(value: X): Type<
  { value: NormalizeTypeLikeT<X> },
  JSONObjectType<{ value: NormalizeTypeLikeJ<X> }>
> {
  return object({ value }) as never
}
