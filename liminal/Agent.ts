import type { Rune } from "./Rune.ts"
import type { Runic } from "./Runic.ts"

export interface Agent<Y extends Rune, T> extends PromiseLike<T>, AsyncIterable<Y, T> {}

export function Agent<Y extends Rune, T>(_runic: Runic<Y, T>): Agent<Y, T> {
  throw 0
}
