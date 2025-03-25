import type { Action } from "./Action/Action.js"
import type { Context } from "./Action/Context.js"
import type { Branch } from "./Action/Branch.js"
import type { LanguageModel } from "./Action/LanguageModel.js"
import type { Value } from "./liminal_util/Value.js"
import type { Emit } from "./Action/Emit.js"
import type {
  TEvent,
  Event,
  LanguageModelEvent,
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
import type { T } from "./Action/T.js"
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
  AS extends ExtractNarrow<Y, T> = ExtractNarrow<Y, T>,
  M extends ExtractNarrow<Y, LanguageModel> = ExtractNarrow<Y, LanguageModel>,
  E extends ExtractNarrow<Y, Emit> = ExtractNarrow<Y, Emit>,
  A extends ExtractNarrow<Y, Context> = ExtractNarrow<Y, Context>,
  Contexts extends Lookup<A> = Lookup<A>,
  B extends ExtractNarrow<Y, Branch> = ExtractNarrow<Y, Branch>,
  BK extends ExtractNarrow<keyof B[""], string> = ExtractNarrow<keyof B[""], string>,
  Tool_ extends ExtractNarrow<Y, Tool> = ExtractNarrow<Y, Tool>,
  DT extends ExtractNarrow<Y, DisableTool> = ExtractNarrow<Y, DisableTool>,
> {
  Agent: A
  Agents: Contexts

  ModelKey: Extract<M["key"] | A[""]["ModelKey"] | Value<B[""]>["ModelKey"], string>
  Event: Expand<
    | ([Extract<Y, string | Array<string>>] extends [never] ? never : UserTextEvent)
    | ([AS] extends [T<infer O>] ? TEvent<O> : never)
    | ([M] extends [never] ? never : LanguageModelEvent<M["key"]>)
    | ([E] extends [never] ? never : ExtractEmitEvent<E>)
    | ([A] extends [never] ? never : EnterEvent | ExtractAgentEvent<A> | ExitEvent<A["key"]>)
    | ([B] extends [never] ? never : BranchesEvent<BK> | EnterEvent | ExtractBranchEvent<B> | ExitEvent<BK>)
    | ([Tool_] extends [never] ? never : EnableToolEvent<Tool_["key"]> | ExtractToolEvent<Tool_>)
    | ([DT] extends [never] ? never : DisableToolEvent<DT["tool"]["key"]>)
  >
  Result: Awaited<R>
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
