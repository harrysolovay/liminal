export interface Message {
  readonly role: MessageRole
  readonly content: string
}

export type MessageRole = "system" | "user" | "assistant"
