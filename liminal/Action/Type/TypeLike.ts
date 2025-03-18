import type { Complete } from "./Complete.js"

export interface TypeLike<T = any> extends Iterable<Complete, T> {
  toJSONSchema: () => object
}
