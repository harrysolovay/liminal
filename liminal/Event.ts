import type { Propagated } from "./Action/Action.js"

export type LiminalEvent<Y extends Propagated = Propagated, T = any> =
  | EnterEvent
  | UserTextEvent
  | AgentTextEvent
  | AgentValueEvent
  | ModelEvent
  | EmitEvent
  | BranchEvent
  | BranchEnterEvent
  | BranchInnerEvent
  | BranchExitEvent
  | AgentEnterEvent
  | AgentInnerEvent
  | AgentExitEvent
  | ExitEvent<T>

export interface EnterEvent {
  type: "Enter"
}

export interface UserTextEvent {
  type: "UserText"
  text: string
}

export interface AgentTextEvent {
  type: "AgentText"
  text: string
}

export interface AgentValueEvent {
  type: "AgentValue"
  jsonType: object
  json: object
}

export interface ModelEvent {
  type: "Model"
  modelKey: string
}

export interface EmitEvent {
  type: "Emit"
  eventKey: string
  value: unknown
}

export interface BranchEvent {
  type: "Branch"
  branchKeys: Array<number | string>
}

export interface BranchEnterEvent {
  type: "BranchCreated"
  branchKey: number | string
}

export interface BranchInnerEvent {
  type: "BranchInner"
  branchKey: number | string
  inner: LiminalEvent
}

export interface BranchExitEvent {
  type: "BranchExit"
  branchKey: number | string
}

export interface AgentEnterEvent {
  type: "AgentCreated"
  agentKey: number | string
}

export interface AgentInnerEvent {
  type: "AgentInner"
  agentKey: number | string
  inner: LiminalEvent
}

export interface AgentExitEvent {
  type: "AgentExit"
  agentKey: number | string
}

export interface ExitEvent<T> {
  type: "Exit"
  value: T
}
