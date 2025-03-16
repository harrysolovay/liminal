export type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never
