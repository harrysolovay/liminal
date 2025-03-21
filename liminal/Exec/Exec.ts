import type { ExtractYScope, Scope } from "../Scope.js"
import type { Action } from "../Action/Action.js"
import type { CoreMessage, LanguageModelV1 } from "ai"
import type { FlowLike } from "../common/FlowLike.js"
import type { Flow } from "../common/Flow.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { Expand } from "../util/Expand.js"
import type { PromiseOr } from "../util/PromiseOr.js"

export type ExecConfig<S extends Scope = Scope> = {
  models: Record<"default" | S["ModelKey"], LanguageModelV1>
  handler?: (event: Expand<S["Event"]>) => PromiseOr<void>
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
