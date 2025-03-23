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

export type EventPath<
  E extends Event,
  A extends Extract<E, AgentEvent> = Extract<E, AgentEvent>,
  B extends Extract<E, BranchEvent> = Extract<E, BranchEvent>,
  T extends Extract<E, ToolEvent> = Extract<E, ToolEvent>,
> =
  | ([A] extends [never] ? [] : { [K in A["agent"]]: ["agent", A["agent"], ...EventPath<A["event"]>] }[A["agent"]])
  | ([B] extends [never] ? [] : { [K in B["branch"]]: ["branch", B["branch"], ...EventPath<B["event"]>] }[B["branch"]])
  | ([T] extends [never] ? [] : { [K in T["tool"]]: ["tool", T["tool"], ...EventPath<T["event"]>] }[T["tool"]])

export interface EnterEvent {
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
