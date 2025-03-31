import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { ToolContentPart } from "./ToolContentPart.js"

export interface ToolMessageEvent extends ActionEventBase<"ToolMessage"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: Array<ToolContentPart>
}
