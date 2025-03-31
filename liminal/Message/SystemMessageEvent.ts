import type { ActionEventBase } from "../Action/ActionEventBase.js"

export interface SystemMessageEvent extends ActionEventBase<"SystemMessage"> {
  content: string
}
