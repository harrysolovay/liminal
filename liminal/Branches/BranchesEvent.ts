import type { ActionEvent } from "../Action/ActionEvent.js"
import type { EventBase } from "../Action/ActionEventBase.js"

export type BranchesEvent =
  | BranchesEnterEvent<string>
  | BranchEnterEvent<string>
  | BranchInnerEvent<string, ActionEvent>
  | BranchExitEvent<string, any>
  | BranchesExitEvent<string, any>

export interface BranchesEnterEvent<K extends string> extends EventBase<"BranchesEnter"> {
  branches: Array<K>
}

export interface BranchEnterEvent<K extends string> extends EventBase<"BranchEnter"> {
  branch: K
}

export interface BranchInnerEvent<K extends string, E extends ActionEvent> extends EventBase<"BranchInner"> {
  branch: K
  inner: E
}

export interface BranchExitEvent<K extends string, R> extends EventBase<"BranchExit"> {
  branch: K
  result: R
}

export interface BranchesExitEvent<K extends string, R> extends EventBase<"BranchesExit"> {
  branches: Array<K>
  result: R
}
