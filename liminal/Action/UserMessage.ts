import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"

export function* UserMessage(text: string | Array<string>): Generator<UserMessage, undefined> {
  return yield ActionBase("UserMessage", { text })
}

export interface UserMessage extends ActionBase<"UserMessage"> {
  text: string | Array<string>
}

export interface UserMessageEvent extends EventBase<"UserMessage"> {
  text: string
}
