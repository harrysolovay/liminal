import type { EventBase } from "../Action/ActionEventBase.js"
import type { AssistantContent } from "./AssistantContent.js"

export interface AssistantMessageEvent extends EventBase<"AssistantMessage"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: AssistantContent
}
