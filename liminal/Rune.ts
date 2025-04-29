export interface Rune<E> {
  [RuneKey]: true
  descriptor: {
    kind: "continuation"
    debug: string
    f: () => any
  } | {
    kind: "event"
    event: E
  } | {
    kind: "self"
  }
}

export namespace Rune {
  export type E<X extends Rune<any>> = X extends Rune<infer E> ? E : never

  export function is(value: unknown): value is Rune<any> {
    return typeof value === "object" && value !== null && RuneKey in value
  }
}

export const RuneKey: unique symbol = Symbol.for("liminal/RuneKey")
export type RuneKey = typeof RuneKey
