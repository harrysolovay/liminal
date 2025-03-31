import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { UserContent } from "./UserContent.js"

export interface UserMessagedEvent extends ActionEventBase<"user_messaged"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: UserContent
}
