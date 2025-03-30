import type { EventBase } from "../Action/ActionEventBase.js"
import type { UserContent } from "./UserContent.js"

export interface UserMessageEvent extends EventBase<"UserMessage"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: UserContent
}
