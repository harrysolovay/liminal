import type { Action } from "./Action/Action.js"
import type { Context } from "./Action/Context.js"
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
  ContextEvent,
  BranchEvent,
  EmitEvent,
} from "./Event.js"
import type { Completion } from "./Action/Assistant.js"
import type { Expand } from "./liminal_util/Expand.js"
import type { DisableTool } from "./Action/DisableTool.js"
import type { Tool } from "./Action/Tool.js"
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
  AS extends ExtractNarrow<Y, Completion> = ExtractNarrow<Y, Completion>,
  M extends ExtractNarrow<Y, Model> = ExtractNarrow<Y, Model>,
  E extends ExtractNarrow<Y, Emit> = ExtractNarrow<Y, Emit>,
  A extends ExtractNarrow<Y, Context> = ExtractNarrow<Y, Context>,
  Contexts extends Lookup<A> = Lookup<A>,
  B extends ExtractNarrow<Y, Branch> = ExtractNarrow<Y, Branch>,
  BK extends ExtractNarrow<keyof B[""], string> = ExtractNarrow<keyof B[""], string>,
  T extends ExtractNarrow<Y, Tool> = ExtractNarrow<Y, Tool>,
  DT extends ExtractNarrow<Y, DisableTool> = ExtractNarrow<Y, DisableTool>,
> {
  Agent: A
  Agents: Contexts

  ModelKey: Extract<M["key"] | A[""]["ModelKey"] | Value<B[""]>["ModelKey"], string>
  Event: Expand<
    | ([Extract<Y, string | Array<string>>] extends [never] ? never : UserTextEvent)
    | ([AS] extends [Completion<infer T>] ? AssistantEvent<T> : never)
    | ([M] extends [never] ? never : ModelEvent<M["key"]>)
    | ([E] extends [never] ? never : ExtractEmitEvent<E>)
    | ([A] extends [never] ? never : EnterEvent | ExtractAgentEvent<A> | ExitEvent<A["key"]>)
    | ([B] extends [never] ? never : BranchesEvent<BK> | EnterEvent | ExtractBranchEvent<B> | ExitEvent<BK>)
    | ([T] extends [never] ? never : EnableToolEvent<T["key"]> | ExtractToolEvent<T>)
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

export type ExtractToolEvent<T extends Tool> = {
  [K in T["key"]]: ToolEvent<K, Extract<T, Tool<K>>[""]["Event"]>
}[T["key"]]

export type ExtractAgentEvent<A extends Context> = {
  [K in A["key"]]: ContextEvent<K, Extract<A, Context<K>>[""]["Event"]>
}[A["key"]]

export type ExtractBranchEvent<B extends Branch> = {
  [K in Key<B[""]>]: BranchEvent<K, Extract<B[""][K], Scope>["Event"]>
}[Key<B[""]>]

export type ExtractEmitEvent<E extends Emit> = {
  [K in E["key"]]: EmitEvent<K, Extract<E, Emit<K>>["value"]>
}[E["key"]]
