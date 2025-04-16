import type { AgentSource } from "../AgentSource.ts"
import type { LEvent } from "../LEvent/LEvent.ts"
import type { Propagated } from "../LEvent/Propagated.ts"
import type { Branch } from "../Rune/Branch.ts"
import type { Rune } from "../Rune/Rune.ts"
import type { LBase } from "./_LBase.ts"

export interface branch<T, E extends LEvent> extends LBase<Branch<E>, T> {}

export type BranchT<S> = {
  [K in keyof S]: S[K] extends AgentSource<Rune, infer T> ? T : never
}

export type BranchE<S> = {
  [K in keyof S]: S[K] extends AgentSource<infer Y> ? Propagated<K, Y["event"]> : never
}[keyof S]

/** Create child agents, each with an isolated copy of the current models and messages. */
export declare function branch<Y extends Rune, T>(source: AgentSource<Y, T>): branch<T, Y["event"]>
export declare function branch<const S extends Array<AgentSource>>(
  sources: S,
): branch<BranchT<S>, BranchE<S>>
export declare function branch<const S extends Record<string, AgentSource>>(sources: S): branch<BranchT<S>, BranchE<S>>
