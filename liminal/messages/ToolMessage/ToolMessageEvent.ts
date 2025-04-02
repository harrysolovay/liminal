import type { ActionEventBase } from "../../Action/ActionEventBase.ts"
import type { ToolContentPart } from "./ToolContentPart.ts"

export interface ToolMessagedEvent extends ActionEventBase<"tool_messaged"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: Array<ToolContentPart>
}
