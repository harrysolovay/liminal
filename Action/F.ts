import type { Action } from "./Action.ts"

export type F<Y extends Action, R> =
  | Iterator<Y, R>
  | AsyncIterator<Y, R>
  | (() => Iterator<Y, R> | AsyncIterator<Y, R>)
