export type Last<T extends Array<any>> = T extends [...infer _Rest, infer L] ? L : never
