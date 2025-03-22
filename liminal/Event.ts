export type Event =
  | UserTextEvent
  | AssistantEvent
  | ModelEvent
  | EmitEvent
  | AgentEnterEvent
  | AgentEvent
  | AgentExitEvent
  | BranchesEvent
  | BranchEnterEvent
  | BranchEvent
  | BranchExitEvent

export interface UserTextEvent {
  type: "UserText"
  text: string
}

export interface AssistantEvent {
  type: "Assistant"
  schema: object
  object: object
}

export interface ModelEvent<K extends keyof any = keyof any> {
  type: "Model"
  model: K
}

export interface EmitEvent<E = any> {
  type: "Emit"
  value: E
}

export interface AgentEnterEvent<K extends keyof any = keyof any> {
  type: "AgentEnter"
  agent: K
}

export interface AgentEvent<K extends keyof any = keyof any, E extends Event = Event> {
  type: "AgentEvent"
  agent: K
  event: E
}

export interface AgentExitEvent<K extends keyof any = keyof any> {
  type: "AgentExit"
  agent: K
}

export interface BranchesEvent<K extends keyof any = keyof any> {
  type: "Branches"
  branches: Array<K>
}

export interface BranchEnterEvent<K extends keyof any = keyof any> {
  type: "BranchEnter"
  branch: K
}

export interface BranchEvent<K extends keyof any = keyof any, E extends Event = Event> {
  type: "BranchEvent"
  branch: K
  event: E
}

export interface BranchExitEvent<K extends keyof any = keyof any> {
  type: "BranchExit"
  branch: K
}
