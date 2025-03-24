export function Phantom<T extends { "": unknown }>(value: Omit<T, "">): T {
  return value as T
}

export interface Phantom<T> {
  "": T
}
