import type { EventBase } from "../Action/ActionEventBase.js"

export interface SystemMessageEvent extends EventBase<"SystemMessage"> {
  content: string
}
