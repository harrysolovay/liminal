export type EnsureNarrow<T> = {} extends T ? never : keyof any extends T ? never : T
