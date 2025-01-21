import type { Thread } from "./Thread.ts"

export interface ThreadMembers<T, E> {
  kind: "Thread"

  self: () => ThreadMembers<T, E> | (() => ThreadMembers<T, E>)
  args?: Array<unknown>

  [Symbol.iterator](): Generator<Thread<T, E>, T>
}
