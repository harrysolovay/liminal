import type { LiminalEvent } from "../LiminalEvent.js"
import type { ExtractChildScope, ExtractModelKey, ExtractYScope, Scope } from "../Scope.js"
import type { Action } from "../Action/Action.js"
import type { CoreMessage, LanguageModelV1 } from "ai"
import type { FlowLike } from "../common/FlowLike.js"
import type { Flow } from "../common/Flow.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"

// biome-ignore lint/correctness/useYield: <explanation>
export async function* Exec<Y extends Action, T, S extends ExtractYScope<"#", Y>>(
  root: FlowLike<Y, T>,
  config: ExecConfig<S>,
): AsyncIterable<S["Event"], T> {
  const rootState = new ExecState(config, root, "default")
  throw 0
}

export interface ExecConfig<S extends Scope = Scope> {
  models: {
    default: LanguageModelV1
  } & {
    [_ in S["ModelKey"]]: LanguageModelV1
  }
}

export class ExecState {
  config: ExecConfig
  flow: Flow
  model: string
  messages: Array<CoreMessage>
  next: unknown
  constructor(config: ExecConfig, flowLike: FlowLike, model: string, messages: Array<CoreMessage> = []) {
    this.config = config
    this.flow = unwrapDeferred(flowLike)
    this.model = model
    this.messages = messages
  }
}
