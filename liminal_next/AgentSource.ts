import type { Rune } from "./Rune/Rune.ts"

export type AgentSource<Y extends Rune = Rune, T = any> =
  | Iterator<Y, T>
  | AsyncIterator<Y, T>
  | Iterable<Y, T>
  | AsyncIterable<Y, T>
