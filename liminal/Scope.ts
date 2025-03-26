// import type { Action } from "./Action/Action.js"
// import type { Context } from "./Action/Context.js"
// import type { Branch } from "./Action/Branch.js"
// import type { Model } from "./Action/Model.js"
// import type { Value as Value_ } from "./liminal_util/Value.js"
// import type { Emit } from "./Action/Emit.js"
// import type {
//   GenerateEvent,
//   Event,
//   ModelEvent,
//   UserTextEvent,
//   BranchesEvent,
//   EnableToolEvent,
//   DisableToolEvent,
//   EnterScopeEvent,
//   ExitScopeEvent,
//   ToolEvent,
//   ContextEvent,
//   BranchEvent,
//   EmitEvent,
// } from "./Action/Scope.js"
// import type { Generation } from "./Action/Generation.js"
// import type { Expand } from "./liminal_util/Expand.js"
// import type { DisableTool } from "./Action/DisableTool.js"
// import type { Tool } from "./Action/Tool.js"
// import type { Key } from "./liminal_util/Key.js"

// export interface Scope {
//   ModelKey: keyof any
//   Event: Event
//   Result: any
//   // Path: any
// }

// type ExtractNarrow<T, U> = U extends T ? never : T extends U ? T : never

// export interface ExtractScope<
//   Y extends Action,
//   R,
//   AS extends ExtractNarrow<Y, Generation> = ExtractNarrow<Y, Generation>,
//   M extends ExtractNarrow<Y, Model> = ExtractNarrow<Y, Model>,
//   E extends ExtractNarrow<Y, Emit> = ExtractNarrow<Y, Emit>,
//   A extends ExtractNarrow<Y, Context> = ExtractNarrow<Y, Context>,
//   Contexts extends Lookup<A> = Lookup<A>,
//   B extends ExtractNarrow<Y, Branch> = ExtractNarrow<Y, Branch>,
//   BK extends ExtractNarrow<keyof B[""], string> = ExtractNarrow<keyof B[""], string>,
//   Tool_ extends ExtractNarrow<Y, Tool> = ExtractNarrow<Y, Tool>,
//   DT extends ExtractNarrow<Y, DisableTool> = ExtractNarrow<Y, DisableTool>,
// > {
//   Agent: A
//   Agents: Contexts

//   ModelKey: Extract<M["key"] | A[""]["ModelKey"] | Value_<B[""]>["ModelKey"], string>
//   Event: Expand<
//     | ([Extract<Y, string | Array<string>>] extends [never] ? never : UserTextEvent)
//     | ([AS] extends [Generation<infer O>] ? GenerateEvent<O> : never)
//     | ([M] extends [never] ? never : ModelEvent<M["key"]>)
//     | ([E] extends [never] ? never : ExtractEmitEvent<E>)
//     | ([A] extends [never] ? never : EnterScopeEvent | ExtractAgentEvent<A> | ExitScopeEvent<A["key"]>)
//     | ([B] extends [never] ? never : BranchesEvent<BK> | EnterScopeEvent | ExtractBranchEvent<B> | ExitScopeEvent<BK>)
//     | ([Tool_] extends [never] ? never : EnableToolEvent<Tool_["key"]> | ExtractToolEvent<Tool_>)
//     | ([DT] extends [never] ? never : DisableToolEvent<DT["tool"]["key"]>)
//   >
//   Result: Awaited<R>
// }

// type Lookup<T extends { key: string }> = {
//   [K in T["key"]]: Extract<T, { key: K }>
// }

// // type ExtractWithKey<F extends { key: string }, K extends string> = Extract<F, { key: K }>

// export type ExtractToolEvent<T extends Tool> = {
//   [K in T["key"]]: ToolEvent<K, Extract<T, Tool<K>>[""]["Event"]>
// }[T["key"]]

// export type ExtractAgentEvent<A extends Context> = {
//   [K in A["key"]]: ContextEvent<K, Extract<A, Context<K>>[""]["Event"]>
// }[A["key"]]

// export type ExtractBranchEvent<B extends Branch> = {
//   [K in Key<B[""]>]: BranchEvent<K, Extract<B[""][K], Scope>["Event"]>
// }[Key<B[""]>]

// export type ExtractEmitEvent<E extends Emit> = {
//   [K in E["key"]]: EmitEvent<K, Extract<E, Emit<K>>["value"]>
// }[E["key"]]
