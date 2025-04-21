export interface Message {
  readonly role: MessageRole
  readonly content: Array<ContentPart>
}

export type MessageRole = "system" | "user" | "assistant"

export type ContentPart = {
  readonly part: string
  readonly alt?: never
} | {
  readonly part: URL
  readonly alt: string
  readonly mime?: string
}
