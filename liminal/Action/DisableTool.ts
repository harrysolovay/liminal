import type { Tool } from "./Tool.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"
import type { Spec } from "../Spec.js"

export function* DisableTool<K extends string>(
  tool: Tool<K>,
): Generator<
  DisableTool<
    K,
    {
      LanguageModel: never
      EmbeddingModel: never
      Event: DisableToolEvent<K>
    }
  >,
  void
> {
  return yield ActionBase("DisableTool", { tool })
}

export interface DisableTool<K extends string = string, S extends Spec = Spec> extends ActionBase<"DisableTool", S> {
  tool: Tool<K>
}

export interface DisableToolEvent<K extends string = string> extends EventBase<"DisableTool"> {
  key: K
}
