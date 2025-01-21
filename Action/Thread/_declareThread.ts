import type { ThreadMembers } from "./_ThreadMembers.ts"
import type { Thread } from "./Thread.ts"

export function declareThread<T, E>(
  self: () => Thread<T, E> | ((...args: any) => Thread<T, E>),
  args?: Array<unknown>,
): Thread<T> {
  return {
    kind: "Thread",
    self,
    args,
    *[Symbol.iterator]() {
      return yield this as never
    },
  } satisfies ThreadMembers<T, E> as never
}
