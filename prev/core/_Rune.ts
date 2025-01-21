export interface Rune<K extends string = string, T = any> {
  T: T

  kind: K
  self: () => Runic<this>
  args?: Array<unknown>

  [Symbol.iterator](): Iterator<this, T>
}

export type Runic<X extends Rune = Rune> = X | ((...args: any) => X)
