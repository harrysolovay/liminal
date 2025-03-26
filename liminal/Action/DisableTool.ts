import type { Tool } from "./Tool.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"
import type { Spec } from "../Spec.js"

export function* DisableTool<K extends string>(
  tool: Tool,
): Generator<
  DisableTool<{
    LanguageModel: never
    EmbeddingModel: never
    Event: DisableToolEvent<K>
  }>,
  void
> {
  return yield ActionBase("DisableTool", { tool })
}

export interface DisableTool<S extends Spec = Spec> extends ActionBase<"DisableTool", S> {
  tool: Tool
}

export interface DisableToolEvent<K extends string = string> extends EventBase<"DisableTool"> {
  key: K
}
