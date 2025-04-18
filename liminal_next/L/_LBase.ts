import type { Rune } from "../runes/Rune.ts"

export interface LBase<Y extends Rune, T> extends Iterable<Y, T> {}
