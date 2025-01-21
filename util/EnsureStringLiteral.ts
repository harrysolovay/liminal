export type EnsureStringLiteral<T extends string> = string extends T ? never : T
