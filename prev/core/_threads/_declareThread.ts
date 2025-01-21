import { declareRune } from "../_declareRune.ts"
import type { Runic } from "../_Rune.ts"
import type { Thread, ThreadMembers } from "../Thread.ts"

export function declareThread<T, E>(
  self: () => Runic<Thread<T, E>>,
  args?: Array<unknown>,
): Thread<T, E> {
  return Object.assign(
    declareRune("Thread", self, args),
    {
      // *iter() {
      //   return yield {
      //     kind: "ThreadIterator",
      //     thread: this as never,
      //     ...{} as { E: never },
      //   }
      // },
      ...{} as { E: E },
    } satisfies ThreadMembers<T, E>,
  )
}
