import type { Spec } from "./Spec.js"

export type LiminalEvent<S extends Spec> =
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

export interface Model<S extends Spec> {
  model: S["Model"]["model"]
}

export type Emit<S extends Spec> = S["Emit"]

export interface AgentCreated<S extends Spec> {
  type: "AgentCreated"
  agent: S["Agent"]["key"]
}

export type AgentInner<S extends Spec> = S["Agent"]

export interface AgentExit<S extends Spec> {
  agent: S["Agent"]["key"]
}

export interface Branch<S extends Spec> {
  branches: Array<keyof S["Branch"]["branches"]>
}

export interface BranchCreated<S extends Spec> {
  branch: keyof S["Branch"]["branches"]
}

export type BranchInner<S extends Spec> = S["Branch"]

export interface BranchExit<S extends Spec> {
  branch: keyof S["Branch"]["branches"]
}
