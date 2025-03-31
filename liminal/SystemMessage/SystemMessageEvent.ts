import type { ActionEventBase } from "../Action/ActionEventBase.ts"

export interface SystemMessagedEvent extends ActionEventBase<"system_messaged"> {
  content: string
}
