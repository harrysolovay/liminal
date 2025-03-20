import type { TypeLike } from "./Type/TypeLike.js"

export interface Stream<T> {
  kind: "Stream"
  typeLike: TypeLike<T>
}

// TODO: object chunks
export function* stream<T>(typeLike: TypeLike<T>): Generator<Stream<T>, ReadableStream<T>> {
  return yield {
    kind: "Stream",
    typeLike,
  }
}
