import type { Action } from "./Action/Action.js"
import type { Agent, ExtractAgentEvent } from "./Action/Agent.js"
import type { Branch } from "./Action/Branch.js"
import type { Model } from "./Action/Model.js"
import type { Value } from "./util/Value.js"
import type { Emit } from "./Action/Emit.js"
import type {
  AgentEnterEvent,
  AgentExitEvent,
  AssistantEvent,
  EmitEvent,
  Event,
  ModelEvent,
  UserTextEvent,
  BranchesEvent,
  BranchEnterEvent,
  BranchExitEvent,
} from "./Event.js"
import type { Assistant } from "./Action/Assistant.js"

export interface Scope {
  ModelKey: keyof any
  Event: Event
}

export interface ExtractYScope<
  Y extends Action,
  M extends Extract<Y, Model> = Extract<Y, Model>,
  E extends Extract<Y, Emit> = Extract<Y, Emit>,
  A extends Extract<Y, Agent> = Extract<Y, Agent>,
  B extends Extract<Y, Branch> = Extract<Y, Branch>,
> {
  ModelKey: M["key"] | A[""]["ModelKey"] | Value<B[""]>["ModelKey"]
  Event:
    | ([Extract<Y, string>] extends [never] ? never : UserTextEvent)
    | ([Extract<Y, Assistant>] extends [never] ? never : AssistantEvent)
    | ([M] extends [never] ? never : ModelEvent<M["key"]>)
    | ([E] extends [never] ? never : EmitEvent<E["value"]>)
    | ([A] extends [never] ? never : AgentEnterEvent<A["key"]> | ExtractAgentEvent<A> | AgentExitEvent<A["key"]>)
    | ([B] extends [never]
        ? never
        :
            | BranchesEvent<keyof B["branches"]>
            | BranchEnterEvent<keyof B["branches"]>
            | ExtractBranchEvent<B>
            | BranchExitEvent<keyof B["branches"]>)
}
