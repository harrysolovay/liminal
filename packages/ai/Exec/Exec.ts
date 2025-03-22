import type { ExtractYScope, Scope } from "../../../liminal/Scope.js"
import type { CoreMessage, LanguageModelV1 } from "ai"
import type { FlowLike } from "../../../liminal/common/FlowLike.js"
import type { Flow } from "../../../liminal/common/Flow.js"
import { unwrapDeferred } from "../../../liminal/util/unwrapDeferred.js"
import type { Expand } from "../../../liminal/util/Expand.js"
import type { PromiseOr } from "../../../liminal/util/PromiseOr.js"
import type { Action } from "../../../liminal/Action/Action.js"

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

export interface Exec {
  exec: <Y extends Action, R, S extends ExtractYScope<Y>>(
    root: FlowLike<Y, R>,
    config: ExecConfig<S>,
  ) => Promise<Awaited<R>>
}

export type ExecConfig<S extends Scope = Scope> = {
  models: Record<"default" | S["ModelKey"], LanguageModelV1>
  handler?: (event: Expand<S["Event"]>) => PromiseOr<void>
  signal?: AbortSignal
}
