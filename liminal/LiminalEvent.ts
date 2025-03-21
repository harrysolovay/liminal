import type { Scope } from "./Scope.js"

export type LiminalEvent<S extends Scope> =
  | UserText
  | AgentText
  | AgentObject
  | Model<S>
  | Emit<S>
  | AgentCreated<S>
  | AgentInner<S>
  | AgentExit<S>
  | Branch<S>
  | BranchCreated<S>
  | BranchInner<S>
  | BranchExit<S>

export interface UserText {
  type: "UserText"
  text: string
}

export interface AgentText {
  type: "AgentText"
  text: string
}

export interface AgentObject {
  type: "AgentObject"
  schema: object
  object: object
}

export interface Model<S extends Scope> {
  model: S["Model"]["model"]
}

export type Emit<S extends Scope> = S["Emit"]

export interface AgentCreated<S extends Scope> {
  type: "AgentCreated"
  agent: S["Agent"]["key"]
}

export type AgentInner<S extends Scope> = S["Agent"]

export interface AgentExit<S extends Scope> {
  agent: S["Agent"]["key"]
}

export interface Branch<S extends Scope> {
  branches: Array<keyof S["Branch"]["branches"]>
}

export interface BranchCreated<S extends Scope> {
  branch: keyof S["Branch"]["branches"]
}

export type BranchInner<S extends Scope> = S["Branch"]

export interface BranchExit<S extends Scope> {
  branch: keyof S["Branch"]["branches"]
}
