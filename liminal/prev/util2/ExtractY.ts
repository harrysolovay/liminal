import type { IteratorLike } from "./IteratorLike.js"

export type ExtractY<R> = R extends IteratorLike<infer Y> ? Y : never
