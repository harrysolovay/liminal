import type { Action } from "./Action/Action.js"
import type { Agent } from "./Action/Agent.js"
import type { Branch } from "./Action/Branch.js"
import type { Model } from "./Action/Model.js"
import type { Value } from "./liminal_util/Value.js"
import type { Emit } from "./Action/Emit.js"
import type {
  AssistantEvent,
  Event,
  ModelEvent,
  UserTextEvent,
  BranchesEvent,
  EnableToolEvent,
  DisableToolEvent,
  EnterEvent,
  ExitEvent,
  ToolEvent,
  AgentEvent,
  BranchEvent,
  EmitEvent,
} from "./Event.js"
import type { Assistant } from "./Action/Assistant.js"
import type { Expand } from "./liminal_util/Expand.js"
import type { AgentTool } from "./Action/AgentTool.js"
import type { DisableTool } from "./Action/DisableTool.js"
import type { UnitTool } from "./Action/UnitTool.js"
import type { Key } from "./liminal_util/Key.js"

export interface Scope {
  ModelKey: keyof any
  Event: Event
  Result: any
  // Path: any
}

type ExtractNarrow<T, U> = U extends T ? never : T extends U ? T : never

export interface ExtractScope<
  Y extends Action,
  R,
  AS extends ExtractNarrow<Y, Assistant> = ExtractNarrow<Y, Assistant>,
  M extends ExtractNarrow<Y, Model> = ExtractNarrow<Y, Model>,
  E extends ExtractNarrow<Y, Emit> = ExtractNarrow<Y, Emit>,
  A extends ExtractNarrow<Y, Agent> = ExtractNarrow<Y, Agent>,
  Agents extends Lookup<A> = Lookup<A>,
  B extends ExtractNarrow<Y, Branch> = ExtractNarrow<Y, Branch>,
  BK extends ExtractNarrow<keyof B[""], string> = ExtractNarrow<keyof B[""], string>,
  UT extends ExtractNarrow<Y, UnitTool> = ExtractNarrow<Y, UnitTool>,
  AT extends ExtractNarrow<Y, AgentTool> = ExtractNarrow<Y, AgentTool>,
  DT extends ExtractNarrow<Y, DisableTool> = ExtractNarrow<Y, DisableTool>,
> {
  Agent: A
  Agents: Agents

  ModelKey: M["key"] | A[""]["ModelKey"] | Value<B[""]>["ModelKey"]
  Event: Expand<
    | ([Extract<Y, string | Array<string>>] extends [never] ? never : UserTextEvent)
    | ([AS] extends [Assistant<infer T>] ? AssistantEvent<T> : never)
    | ([M] extends [never] ? never : ModelEvent<M["key"]>)
    | ([E] extends [never] ? never : ExtractEmitEvent<E>)
    | ([A] extends [never] ? never : EnterEvent | ExtractAgentEvent<A> | ExitEvent<A["key"]>)
    | ([B] extends [never] ? never : BranchesEvent<BK> | EnterEvent | ExtractBranchEvent<B> | ExitEvent<BK>)
    | ([UT] extends [never] ? never : EnableToolEvent<UT["key"]>)
    | ([AT] extends [never] ? never : EnableToolEvent<AT["key"]> | ExtractToolEvent<AT>)
    | ([DT] extends [never] ? never : DisableToolEvent<DT["tool"]["key"]>)
  >
  Result: Awaited<R>
  // Path: [A] extends [never]
  //   ? []
  //   : {
  //       [K in A["key"]]: ["agent", K, ...Agents[K][""]["Path"], A["key"]]
  //     }[A["key"]]
  // Path: [A] extends [never]
  //   ? []
  //   : {
  //       [K in A["key"]]: ["agent", K, [ExtractWithKey<A, K>] extends [never] ? [] : [ExtractWithKey<A, K>[""]["Path"]]]
  //     }
  // | ([B] extends [never]
  //     ? []
  //     : { [K in keyof B[""]]: ["branch", K, ...Extract<Value<Extract<B, Branch<K>>[""]>, Scope>] }[A["key"]])
}

type Lookup<T extends { key: string }> = {
  [K in T["key"]]: Extract<T, { key: K }>
}

// type ExtractWithKey<F extends { key: string }, K extends string> = Extract<F, { key: K }>

export type ExtractToolEvent<T extends AgentTool> = {
  [K in T["key"]]: ToolEvent<K, Extract<T, AgentTool<K>>[""]["Event"]>
}[T["key"]]

export type ExtractAgentEvent<A extends Agent> = {
  [K in A["key"]]: AgentEvent<K, Extract<A, Agent<K>>[""]["Event"]>
}[A["key"]]

export type ExtractBranchEvent<B extends Branch> = {
  [K in Key<B[""]>]: BranchEvent<K, Extract<B[""][K], Scope>["Event"]>
}[Key<B[""]>]

export type ExtractEmitEvent<E extends Emit> = {
  [K in E["key"]]: EmitEvent<K, Extract<E, Emit<K>>["value"]>
}[E["key"]]
