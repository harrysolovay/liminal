import type { LiminalEvent } from "../LiminalEvent.js"
import type { Scope } from "../Scope.js"
import type { Action } from "../Action/Action.js"
import type { CoreMessage, LanguageModelV1 } from "ai"
import type { FlowLike } from "../common/FlowLike.js"
import type { Flow } from "../common/Flow.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"

// biome-ignore lint/correctness/useYield: <explanation>
export async function* Exec<Y extends Action, T, S extends Scope<Y>>(
  flow: FlowLike<Y, T>,
  config: ExecConfig,
): Exec<S> {
  throw 0
}

export interface Exec<S extends Scope = Scope> extends AsyncIterable<LiminalEvent<S>, void> {}

export interface ExecConfig<M extends keyof any = keyof any> {
  models: {
    default: LanguageModelV1
  } & {
    [K in M]: LanguageModelV1
  }
}

class ExecState {
  flow: Flow
  model: string
  messages: Array<CoreMessage>
  next: unknown
  constructor(flowLike: FlowLike, model: string, messages: Array<CoreMessage> = []) {
    this.flow = unwrapDeferred(flowLike)
    this.model = model
    this.messages = messages
  }
}
