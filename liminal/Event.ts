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

export interface EnterEvent<K extends keyof any = keyof any> {
  key: K
  type: "Enter"
}

export interface UserTextEvent {
  type: "UserText"
  text: string
}

export type AssistantEvent = {
  type: "Assistant"
} & (
  | {
      schema: object
      object: object
      text?: never
    }
  | {
      schema?: never
      object?: never
      text: string
    }
)

export interface ModelEvent<K extends keyof any = keyof any> {
  type: "Model"
  model: K
}

export interface EmitEvent<E = any> {
  type: "Emit"
  value: E
}

export interface AgentEvent<K extends keyof any = keyof any, E extends Event = Event> {
  type: "AgentEvent"
  agent: K
  event: E
}

export interface BranchesEvent<K extends keyof any = keyof any> {
  type: "Branches"
  branches: Array<K>
}

export interface BranchEvent<K extends keyof any = keyof any, E extends Event = Event> {
  type: "Branch"
  branch: K
  event: E
}

export interface EnableToolEvent<K extends keyof any = keyof any> {
  type: "EnableTool"
  key: K
}

export interface ToolEvent<K extends keyof any = keyof any, E extends Event = Event> {
  type: "AgentTool"
  tool: K
  event: E
}

export interface DisableToolEvent<K extends keyof any = keyof any> {
  type: "DisableTool"
  key: K
}

export interface ExitEvent<K extends keyof any = keyof any, T = any> {
  type: "Exit"
  key: K
  result: T
}
