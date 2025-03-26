import type { Spec } from "../Spec.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"

export function* UserMessage(text: string | Array<string>): Generator<
  UserMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: UserMessageEvent
  }>,
  undefined
> {
  return yield ActionBase("UserMessage", { text })
}

export interface UserMessage<S extends Spec = Spec> extends ActionBase<"UserMessage", S> {
  text: string | Array<string>
}

export interface UserMessageEvent extends EventBase<"UserMessage"> {
  text: string
}
