import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import type { ToolContentPart } from "./ToolContentPart.js"
import type { ToolMessagedEvent } from "./ToolMessageEvent.js"

export interface ToolMessage<S extends Spec = Spec> extends ActionBase<"tool_message", S> {
  content: Array<ToolContentPart>
}

export function* ToolMessage(content: Array<ToolContentPart>): Generator<
  ToolMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: ToolMessagedEvent
  }>,
  void
> {
  return yield ActionBase("tool_message", { content })
}
