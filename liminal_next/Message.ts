export interface Message {
  role: MessageRole
  content: string
}

export type MessageRole = "system" | "user" | "assistant"
