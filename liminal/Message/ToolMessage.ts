import type { Spec } from "../Spec.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { ToolContentPart } from "./ToolContentPart.js"
import type { ToolMessageEvent } from "./ToolMessageEvent.js"

export interface ToolMessage<S extends Spec = Spec> extends ActionBase<"ToolMessage", S> {
  content: Array<ToolContentPart>
}

export function* ToolMessage(content: Array<ToolContentPart>): Generator<
  ToolMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: ToolMessageEvent
  }>,
  void
> {
  return yield ActionBase("ToolMessage", { content })
}
