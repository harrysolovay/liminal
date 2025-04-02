import { ActionBase } from "../../Action/ActionBase.ts"
import type { Spec } from "../../Spec.ts"
import type { ToolContentPart } from "./ToolContentPart.ts"
import type { ToolMessagedEvent } from "./ToolMessageEvent.ts"

export interface ToolMessage<S extends Spec = Spec> extends ActionBase<"tool_message", S> {
  content: Array<ToolContentPart>
}

export function* toolMessage(content: Array<ToolContentPart>): Generator<
  ToolMessage<{
    Field: never
    Event: ToolMessagedEvent
  }>,
  void
> {
  return yield ActionBase("tool_message", { content })
}
