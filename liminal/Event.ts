export type Event =
  | EnterEvent
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
  | EnableToolEvent
  | ToolEvent
  | DisableToolEvent
  | ExitEvent

export interface EnterEvent {
  type: "Enter"
}

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

export interface AgentExitEvent<K extends keyof any = keyof any, T = any> {
  type: "AgentExit"
  agent: K
  result: T
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
  type: "Branch"
  branch: K
  event: E
}

export interface BranchExitEvent<K extends keyof any = keyof any, T = any> {
  type: "BranchExit"
  branch: K
  result: T
}

export interface EnableToolEvent<K extends keyof any = keyof any> {
  type: "EnableTool"
  key: K
}

export interface ToolEvent<K extends keyof any = keyof any, E extends Event = Event> {
  type: "Tool"
  tool: K
  event: E
}

export interface DisableToolEvent<K extends keyof any = keyof any> {
  type: "DisableTool"
  key: K
}

export interface ExitEvent<T = any> {
  type: "Exit"
  result: T
}
