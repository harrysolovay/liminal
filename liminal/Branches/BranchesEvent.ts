import type { ActionEvent } from "../Action/ActionEvent.js"
import type { EventBase } from "../Action/ActionEventBase.js"

export type BranchesEvent =
  | BranchesEnterEvent
  | BranchEnterEvent
  | BranchInnerEvent
  | BranchExitEvent
  | BranchesExitEvent

export interface BranchesEnterEvent<K extends keyof any = keyof any> extends EventBase<"BranchesEnter"> {
  branches: K
}

export interface BranchEnterEvent<K extends keyof any = keyof any, L extends keyof any = keyof any>
  extends EventBase<"BranchEnter">
{
  branches: K
  branch: L
}

export interface BranchInnerEvent<
  K extends keyof any = keyof any,
  L extends keyof any = keyof any,
  E extends ActionEvent = ActionEvent,
> extends EventBase<"BranchInner"> {
  branches: K
  branch: L
  inner: E
}

export interface BranchExitEvent<K extends keyof any = keyof any, L extends keyof any = keyof any, R = any>
  extends EventBase<"BranchExit">
{
  branches: K
  branch: L
  result: R
}

export interface BranchesExitEvent<K extends keyof any = keyof any, R = any> extends EventBase<"BranchesExit"> {
  branches: K
  result: R
}
