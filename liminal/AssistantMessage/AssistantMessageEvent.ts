import type { ActionEventBase } from "../Action/ActionEventBase.ts"
import type { AssistantContent } from "./AssistantContent.ts"

export interface AssistantMessagedEvent extends ActionEventBase<"assistant_messaged"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: AssistantContent
}
