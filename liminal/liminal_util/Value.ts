export type Value<T> = T extends Array<any> ? T[number] : T[keyof T]
