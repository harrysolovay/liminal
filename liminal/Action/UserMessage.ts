export function* UserMessage(text: string | Array<string>): Generator<UserMessage, undefined> {
  return yield {
    kind: "UserMessage",
    text,
  }
}

export interface UserMessage {
  kind: "UserMessage"
  text: string | Array<string>
}

export interface UserMessageEvent {
  type: "UserMessage"
  text: string
}
