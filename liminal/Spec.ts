import type { Action } from "./Action/Action.js"
import type { Agent } from "./Action/Agent.js"
import type { Branch } from "./Action/Branch.js"
import type { Emit } from "./Action/Emit.js"
import type { Model } from "./Action/Model.js"

export type Spec<K extends keyof any = keyof any, Y extends Action = Action, T = any> = {
  Key: K
  Model: Extract<Y, Model>
  Emit: Extract<Y, Emit>
  Agent: Extract<Y, Agent>
  Branch: Extract<Y, Branch>
  Done: T
}
