import type { ActionEventBase } from "../Action/ActionEventBase.ts"
import type { UserContent } from "./UserContent.ts"

export interface UserMessagedEvent extends ActionEventBase<"user_messaged"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: UserContent
}
