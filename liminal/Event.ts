export type Event =
  | EnterEvent
  | UserTextEvent
  | AssistantEvent
  | ModelEvent
  | EmitEvent
  | AgentEvent
  | BranchesEvent
  | BranchEvent
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

export interface AssistantEvent<V = any> {
  type: "Assistant"
  value: V
  schema?: object
}

export interface ModelEvent<K extends string = string> {
  type: "Model"
  model: K
}

export interface EmitEvent<K extends string = string, E = any> {
  type: "Emit"
  event: K
  value: E
}

export interface AgentEvent<K extends string = string, E extends Event = Event> {
  type: "Agent"
  agent: K
  system: string
  event: E
}

export interface BranchesEvent<K extends string = string> {
  type: "Branches"
  branches: Array<K>
}

export interface BranchEvent<K extends string = string, E extends Event = Event> {
  type: "Branch"
  branch: K
  event: E
}

export interface EnableToolEvent<K extends string = string> {
  type: "EnableTool"
  key: K
}

export interface ToolEvent<K extends string = string, E extends Event = Event> {
  type: "AgentTool"
  tool: K
  description: string
  event: E
}

export interface DisableToolEvent<K extends string = string> {
  type: "DisableTool"
  key: K
}

export interface ExitEvent<T = any> {
  type: "Exit"
  result: T
}
