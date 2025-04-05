import type { TupleToRecord } from "./TupleToRecord.ts"

export type EnsureRecord<T> = T extends Array<any> ? TupleToRecord<T> : T
