export type Result<T, E> = {
  value: T
  thrown?: never
} | {
  value?: never
  thrown: E
}
