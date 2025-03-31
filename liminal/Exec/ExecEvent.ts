import type { ActionEventBase } from "../Action/ActionEventBase.js"

export type RootEvent<T = any> = RootEnterEvent | RootExitEvent<T>

export interface RootEnterEvent extends ActionEventBase<"RootEnter"> {}

export interface RootExitEvent<T = any> extends ActionEventBase<"RootExit"> {
  result: T
}
