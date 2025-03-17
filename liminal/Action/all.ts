export declare function all<
  A extends Array<Iterator<any, any> | Iterator<any, any> | (() => Iterator<any, any> | AsyncIterator<any, any>)>,
>(...iterators: A): Iterable<any, { [K in keyof A]: A[K] extends DeferredOr<IteratorLike<any, infer T>> ? T : never }>

export interface All {
  kind: "All"
}

type IteratorLike<Y = any, T = any> = Iterator<Y, T> | AsyncIterator<Y, T>
type DeferredOr<T> = T | (() => T)
