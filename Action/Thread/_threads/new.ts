import type { EnsureStringLiteral } from "../../../util/EnsureStringLiteral.ts"
import type { Action, ExtractMaybeE } from "../../Action.ts"
import type { F } from "../../F.ts"
import { declareThread } from "../_declareThread.ts"
import type { Thread } from "../Thread.ts"

function new_<K extends string, Y extends Action, R>(
  key: EnsureStringLiteral<K>,
  f: F<Y, R>,
): Thread<Awaited<R>, ExtractMaybeE<K, Y>> {
  return declareThread(() => new_<K, Y, R>, [key, f])
}
Object.defineProperty(new_, "name", { value: "new" })
export { new_ as new }
