import type { IteratorLike } from "./IteratorLike.js"

export type ExtractT<R> = Awaited<R extends IteratorLike<any, infer T> ? T : R>
