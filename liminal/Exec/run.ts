import type { ExtractYScope, Scope } from "../Scope.js"
import type { Action } from "../Action/Action.js"
import type { CoreMessage, LanguageModelV1 } from "ai"
import type { FlowLike } from "../common/FlowLike.js"
import type { Flow } from "../common/Flow.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"

export async function run<Y extends Action, T, S extends ExtractYScope<"#", Y>>(
  root: FlowLike<Y, T>,
  config: ExecConfig<S>,
  visitors?: (event: S["Event"]) => void,
): Promise<T> {
  const rootState = new ExecState(config, root, "default")
  throw 0
}

export interface ExecConfig<S extends Scope = Scope> {
  models: {
    default: LanguageModelV1
  } & {
    [_ in S["ModelKey"]]: LanguageModelV1
  }
  signal?: AbortSignal
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
