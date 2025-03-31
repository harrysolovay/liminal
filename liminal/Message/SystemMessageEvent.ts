import type { ActionEventBase } from "../Action/ActionEventBase.js"

export interface SystemMessagedEvent extends ActionEventBase<"system_messaged"> {
  content: string
}
