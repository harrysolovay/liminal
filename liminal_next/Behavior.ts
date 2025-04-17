import type { Rune } from "./Rune/Rune.ts"
import type { DeferredOr } from "./util/DeferredOr.ts"

export type RuneIterator<Y extends Rune = Rune, T = any> = Iterator<Y, T> | AsyncIterator<Y, T>

export type RuneIterable<Y extends Rune = Rune, T = any> = Iterable<Y, T> | AsyncIterable<Y, T>

export type AgentBehavior<Y extends Rune = Rune, T = any> = DeferredOr<RuneIterator<Y, T> | RuneIterable<Y, T>>

export type NormalizeAgentBehavior<S extends AgentBehavior> = S extends RuneIterator ? S
  : S extends RuneIterable<infer Y extends Rune, infer T> ? RuneIterator<Y, T>
  : S extends (() => RuneIterator<infer Y extends Rune, infer T>) ? RuneIterator<Y, T>
  : S extends (() => RuneIterable<infer Y extends Rune, infer T>) ? RuneIterator<Y, T>
  : never

export function normalizeAgentBehavior(behavior: AgentBehavior): RuneIterator {
  if ("next" in behavior) {
    return behavior
  } else if (Symbol.iterator in behavior) {
    return behavior[Symbol.iterator]()
  } else if (Symbol.asyncIterator in behavior) {
    return behavior[Symbol.asyncIterator]()
  }
  const unwrapped = behavior()
  if ("next" in unwrapped) {
    return unwrapped
  } else if (Symbol.iterator in unwrapped) {
    return unwrapped[Symbol.iterator]()
  }
  return unwrapped[Symbol.asyncIterator]()
}
