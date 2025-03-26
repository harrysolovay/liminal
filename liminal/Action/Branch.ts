import type { AgentLike } from "../common/AgentLike.js"

export function* Branch<const B extends Branches>(
  branches: B,
): Generator<Branch, { [K in keyof B]: B[K] extends AgentLike<any, infer R> ? Awaited<R> : never }> {
  return yield {
    kind: "Branch",
    branches,
  }
}

export interface Branch {
  kind: "Branch"
  branches: Branches
}

export type Branches = Array<AgentLike> | Record<string, AgentLike>

export interface BranchesEvent<K extends string = string> {
  type: "Branches"
  keys: Array<K>
}

export interface BranchEvent<K extends string = string, E extends Event = Event> {
  type: "Branch"
  key: K
  event: E
}
