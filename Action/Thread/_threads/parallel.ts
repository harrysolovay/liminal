import type { Expand } from "../../../util/Expand.ts"
import type { U2I } from "../../../util/U2I.ts"
import { declareThread } from "../_declareThread.ts"
import type { Thread } from "../Thread.ts"

export function parallel<A extends Array<Thread>>(
  ...threads: A
): Thread<{ [I in keyof A]: A[I]["T"] }, Expand<U2I<A[number]["E"]>>> {
  return declareThread(() => parallel<A>, threads)
}
