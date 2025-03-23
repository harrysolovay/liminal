import type { Action } from "./Action/Action.js"
import type { Agent, ExtractAgentEvent } from "./Action/Agent.js"
import type { Branch, ExtractBranchEvent } from "./Action/Branch.js"
import type { Model } from "./Action/Model.js"
import type { Value } from "./liminal_util/Value.js"
import type { Emit, ExtractEmitEvent } from "./Action/Emit.js"
import type {
  AssistantEvent,
  EmitEvent,
  Event,
  ModelEvent,
  UserTextEvent,
  BranchesEvent,
  EnableToolEvent,
  DisableToolEvent,
  EnterEvent,
  ExitEvent,
} from "./Event.js"
import type { Assistant } from "./Action/Assistant.js"
import type { Expand } from "./liminal_util/Expand.js"
import type { ExtractToolEvent, AgentTool } from "./Action/AgentTool.js"
import type { DisableTool } from "./Action/DisableTool.js"
import type { UnitTool } from "./Action/UnitTool.js"

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
  BK extends Extract<keyof B[""], string> = Extract<keyof B[""], string>,
  UT extends Extract<Y, UnitTool> = Extract<Y, UnitTool>,
  AT extends Extract<Y, AgentTool> = Extract<Y, AgentTool>,
  DT extends Extract<Y, DisableTool> = Extract<Y, DisableTool>,
> {
  ModelKey: M["key"] | A[""]["ModelKey"] | Value<B[""]>["ModelKey"]
  Event: Expand<
    | ([Extract<Y, string | Array<string>>] extends [never] ? never : UserTextEvent)
    | ([Extract<Y, Assistant>] extends [never] ? never : AssistantEvent)
    | ([M] extends [never] ? never : ModelEvent<M["key"]>)
    | ([E] extends [never] ? never : ExtractEmitEvent<E>)
    | ([A] extends [never] ? never : EnterEvent | ExtractAgentEvent<A> | ExitEvent<A["key"]>)
    | ([B] extends [never] ? never : BranchesEvent<BK> | EnterEvent | ExtractBranchEvent<B> | ExitEvent<BK>)
    | ([UT] extends [never] ? never : EnableToolEvent<UT["key"]>)
    | ([AT] extends [never] ? never : EnableToolEvent<AT["key"]> | ExtractToolEvent<AT>)
    | ([DT] extends [never] ? never : DisableToolEvent<DT["tool"]["key"]>)
  >
  Result: Awaited<R>
}
