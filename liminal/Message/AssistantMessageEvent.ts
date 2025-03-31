import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { AssistantContent } from "./AssistantContent.js"

export interface AssistantMessageEvent extends ActionEventBase<"AssistantMessage"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: AssistantContent
}
