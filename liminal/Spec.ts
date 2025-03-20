import type { Action } from "./Action/Action.js"
import type { Agent } from "./Action/Agent.js"
import type { Branch } from "./Action/Branch.js"
import type { Emit } from "./Action/Emit.js"
import type { Model } from "./Action/Model.js"
import type { Expand } from "./util/Expand.js"

export interface Spec {
  ModelKey: keyof any
  Key: keyof any
  Emit: any
  AgentKey: keyof any
  AgentEvent: any
  BranchKey: keyof any
  BranchEvent: any
  DoneValue: any
}

export type ExtractSpec<K extends keyof any, Y extends Action, T> = {
  Key: K
  Emit: Extract<Y, Emit>["value"]
  ModelKey: Extract<Y, Model>["key"]
  AgentKey: Extract<Y, Agent>["key"]
  AgentEvent: Extract<Y, Agent>["spec"]
  BranchKey: keyof Extract<Y, Branch>["branches"]
  BranchEvent: Extract<Y, Branch>[keyof Extract<Y, Branch>]
  DoneValue: T
}

export type LiminalEvent<S extends Spec = Spec> = Make<{
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
  Model: {
    model: S["ModelKey"]
  }
  Emit: S["Emit"]
  AgentCreated: {
    agent: S["AgentKey"]
  }
  AgentInner: S["AgentEvent"]
  AgentExit: {
    agent: S["AgentKey"]
  }
  Branch: {
    branches: Array<S["BranchKey"]>
  }
  BranchCreated: {
    branch: Array<S["BranchKey"]>
  }
  BranchInner: S["BranchEvent"]
  BranchExit: {
    branch: S["BranchKey"]
  }
}>

type Make<T> = {
  [K in keyof T]: Expand<
    {
      event: K
      eventId: number
    } & T[K]
  >
}[keyof T]
