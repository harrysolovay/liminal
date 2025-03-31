import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { UserContent } from "./UserContent.js"

export interface UserMessageEvent extends ActionEventBase<"UserMessage"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: UserContent
}
