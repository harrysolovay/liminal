import type { EnsureStringLiteral } from "../../../util/EnsureStringLiteral.ts"
import type { Action, ExtractMaybeE } from "../../Action.ts"
import type { F } from "../../F.ts"
import { declareThread } from "../_declareThread.ts"
import type { Thread } from "../Thread.ts"

export function reduce<K extends string, Y extends Action, R>(
  key: EnsureStringLiteral<K>,
  f: F<Y, R>,
): Thread<Awaited<R>, ExtractMaybeE<K, Y>> {
  return declareThread(() => reduce<K, Y, R>, [key, f])
}
