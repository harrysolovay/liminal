export type Result<T, E> = {
  value: T
  error?: never
} | {
  value?: never
  error: E
}
