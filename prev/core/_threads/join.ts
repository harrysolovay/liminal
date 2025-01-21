import type { Expand } from "../../../util/Expand.ts"
import type { U2I } from "../../../util/U2I.ts"
import type { Thread } from "../Thread.ts"
import { declareThread } from "./_declareThread.ts"

export function join<A extends Array<Thread>>(
  ...threads: A
): Thread<{ [K in keyof A]: A[K]["T"] }, Expand<U2I<A[number]["E"]>>> {
  return declareThread(() => join<A>, threads)
}
