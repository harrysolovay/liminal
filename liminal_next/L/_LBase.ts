import type { Rune } from "../Rune/Rune.ts"

export interface LBase<R extends Rune, T> extends Iterable<R, T> {}
