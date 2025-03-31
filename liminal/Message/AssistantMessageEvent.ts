import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { AssistantContent } from "./AssistantContent.js"

export interface AssistantMessagedEvent extends ActionEventBase<"assistant_messaged"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: AssistantContent
}
