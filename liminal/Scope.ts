import type { Action } from "./Action/Action.js"
import type { Agent, ExtractAgentEvent } from "./Action/Agent.js"
import type { Branch, ExtractBranchEvent } from "./Action/Branch.js"
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
  EnableToolEvent,
  DisableToolEvent,
} from "./Event.js"
import type { Assistant } from "./Action/Assistant.js"
import type { Expand } from "./util/Expand.js"
import type { Tool } from "./Action/Tool.js"
import type { DisableTool } from "./Action/DisableTool.js"

export interface Scope {
  ModelKey: keyof any
  Event: Event
  Result: any
}

export interface ExtractYScope<
  Y extends Action,
  R,
  M extends Extract<Y, Model> = Extract<Y, Model>,
  E extends Extract<Y, Emit> = Extract<Y, Emit>,
  A extends Extract<Y, Agent> = Extract<Y, Agent>,
  B extends Extract<Y, Branch> = Extract<Y, Branch>,
  ET extends Extract<Y, Tool> = Extract<Y, Tool>,
  DT extends Extract<Y, DisableTool> = Extract<Y, DisableTool>,
> {
  ModelKey: M["key"] | A[""]["ModelKey"] | Value<B[""]>["ModelKey"]
  Event: Expand<
    | ([Extract<Y, string | Array<string>>] extends [never] ? never : UserTextEvent)
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
    | ([ET] extends [never] ? never : EnableToolEvent<ET["key"]>)
    | ([DT] extends [never] ? never : DisableToolEvent<DT["key"]>)
  >
  Result: Awaited<R>
}
