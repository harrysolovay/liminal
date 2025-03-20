export type ArrayOfLength<
  T,
  L extends number,
  A extends Array<T> = [],
> = number extends L ? Array<T> : L extends A["length"] ? A : ArrayOfLength<T, L, [...A, T]>
