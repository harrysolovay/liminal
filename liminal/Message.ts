export interface Message {
  readonly role: MessageRole
  readonly parts: Array<Content>
}

export type MessageRole = "system" | "user" | "assistant"

export type Content = {
  readonly part: string
  readonly alt?: never
  readonly mime?: never
} | {
  readonly part: URL
  readonly alt: string
  readonly mime?: string
}
