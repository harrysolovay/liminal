import type { ThreadMembers } from "./_ThreadMembers.ts"

export * as Thread from "./_threads/mod.ts"

export interface Thread<T = any, E = any> extends ThreadMembers<T, E> {
  T: T
  E: E
}
