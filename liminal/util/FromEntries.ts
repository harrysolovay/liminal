export type FromEntries<E extends [keyof any, any]> = {
  [K in E[0]]: E extends [K, infer V] ? V : never
}
