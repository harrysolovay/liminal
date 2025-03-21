import type { Action } from "./Action/Action.js"
import type { Agent } from "./Action/Agent.js"
import type { Branch } from "./Action/Branch.js"
import type { Model } from "./Action/Model.js"
import type { Expand } from "./util/Expand.js"
import type { Value } from "./util/Value.js"
import type { LiminalEvent } from "./LiminalEvent.js"

export type Scope = {
  Key: keyof any
  ModelKey: keyof any
  Event: LiminalEvent
  Result: any
}

export type ExtractYScope<K extends keyof any, Y extends Action, R> = Expand<{
  Key: K
  ModelKey: ExtractModelKey<Y>
  Event: LiminalEvent<K, Y>
  Result: Awaited<R>
}>

export type ExtractModelKey<Y extends Action> =
  | Extract<Y, Model>["model"]
  | Extract<Y, Agent>["scope"]["ModelKey"]
  | Extract<Value<Extract<Y, Branch>["scopes"]>, Scope>["ModelKey"]

export type ExtractChildScope<Y extends Action> =
  | Extract<Y, Agent>["scope"]
  | Extract<Value<Extract<Y, Branch>["scopes"]>, Scope>
