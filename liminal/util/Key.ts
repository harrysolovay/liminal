export type Key<T> = T extends Array<any> ? Extract<keyof T, number> : keyof T
