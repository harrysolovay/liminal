import type { AgentBehavior } from "../Behavior.ts"
import type { LEvent } from "../LEvent/LEvent.ts"
import type { Propagated } from "../LEvent/Propagated.ts"
import type { Branch } from "../Rune/Branch.ts"
import type { Rune } from "../Rune/Rune.ts"
import type { LBase } from "./_LBase.ts"

export interface branch<T, E extends LEvent> extends LBase<Branch<E>, T> {}

export type BranchT<S> = {
  [K in keyof S]: S[K] extends AgentBehavior<Rune, infer T> ? T : never
}

export type BranchE<S> = {
  [K in keyof S]: S[K] extends AgentBehavior<infer Y> ? Propagated<K, Y["event"]> : never
}[keyof S]

/** Create child agents, each with an isolated copy of the current models and messages. */
export declare function branch<Y extends Rune, T>(source: AgentBehavior<Y, T>): branch<T, Y["event"]>
export declare function branch<const S extends Array<AgentBehavior>>(
  sources: S,
): branch<BranchT<S>, BranchE<S>>
export declare function branch<const S extends Record<string, AgentBehavior>>(
  sources: S,
): branch<BranchT<S>, BranchE<S>>
