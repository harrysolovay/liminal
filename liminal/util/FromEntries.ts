export type FromEntries<E extends [keyof any, any]> = {
  [K in E[0]]: Extract<E, [K, any]> extends [K, infer V] ? V : never
}
