import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { ToolContentPart } from "./ToolContentPart.js"

export interface ToolMessagedEvent extends ActionEventBase<"tool_messaged"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: Array<ToolContentPart>
}
