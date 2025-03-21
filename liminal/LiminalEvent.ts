import type { Action } from "./Action/Action.js"
import type { Agent } from "./Action/Agent.js"
import type { Branch } from "./Action/Branch.js"
import type { Emit } from "./Action/Emit.js"
import type { Model } from "./Action/Model.js"
import type { ExtractChildScope, Scope } from "./Scope.js"
import type { Expand } from "./util/Expand.js"
import type { Key } from "./util/Key.js"
import type { Value } from "./util/Value.js"

export type LiminalEvent<K extends keyof any = keyof any, Y extends Action = Action> = Value<Events<K, Y>>
export type Events<K extends keyof any = keyof any, Y extends Action = Action> = Make<{
  UserText: {
    text: string
  }
  AgentText: {
    text: string
  }
  AgentObject: {
    schema: object
    object: object
  }
  ModelEvent: {
    scope: K
    model: Extract<Y, Model>["model"] | ExtractChildScope<Y>["ModelKey"]
  }
  EmitEvent: {
    scope: K
    emit: Extract<Y, Emit>
  }
  AgentCreated: {
    scope: K
    agent: Extract<Y, Agent>["key"]
  }
  AgentInnerEvent: {
    scope: K
    inner: ExtractChildScope<Y>["Event"]
  }
  AgentExitEvent: {
    scope: K
    agent: Extract<Y, Agent>["key"]
  }
  BranchEvent: {
    scope: K
    branches: Array<Key<Extract<Y, Branch>["branches"]>>
  }
  BranchCreatedEvent: {
    scope: K
    branch: Key<Extract<Y, Branch>["branches"]>
  }
  BranchInnerEvent: {
    scope: K
    inner: Extract<Value<Extract<Y, Branch>["scopes"]>, Scope>["Event"]
  }
  BranchExitEvent: {
    scope: K
    branch: Key<Extract<Y, Branch>["branches"]>
  }
}>

type Make<T> = {
  [K in keyof T]: Expand<
    {
      id: number
      type: K
    } & T[K]
  >
}
