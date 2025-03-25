import type { JSONValue } from "./liminal_util/JSONValue.js"

export type Event =
  | EnterEvent
  | UserTextEvent
  | TEvent
  | LanguageModelEvent
  | EmbeddingModelEvent
  | EmitEvent
  | ContextEvent
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

export interface TEvent<O = any> {
  type: "T"
  value: O
  schema?: object
}

export interface LanguageModelEvent<K extends string = string> {
  type: "LanguageModel"
  key: K
}

export interface EmbeddingModelEvent<K extends string = string> {
  type: "EmbeddingModel"
  key: K
}

export interface EmitEvent<K extends string = string, E = any> {
  type: "Emit"
  key: K
  value: E
}

export interface ContextEvent<K extends string = string, E extends Event = Event> {
  type: "Context"
  key: K
  event: E
}

export interface BranchesEvent<K extends string = string> {
  type: "Branches"
  keys: Array<K>
}

export interface BranchEvent<K extends string = string, E extends Event = Event> {
  type: "Branch"
  key: K
  event: E
}

export interface EnableToolEvent<K extends string = string> {
  type: "EnableTool"
  key: K
  description: string
  schema: object
}

export interface ToolEvent<K extends string = string, E extends Event = Event> {
  type: "Tool"
  key: K
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
