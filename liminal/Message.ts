export type Message = Messages[keyof Messages]
export type Messages = {
  system: SystemMessage
  user: UserMessage
  assistant: AssistantMessage
  tool: ToolMessage
}

export interface SystemMessage extends MessageBase<"system"> {}
export interface UserMessage extends MessageBase<"user"> {}
export interface AssistantMessage extends MessageBase<"assistant"> {}
export interface ToolMessage extends MessageBase<"tool"> {}

interface MessageBase<R extends MessageRole> {
  readonly role: R
  readonly content: MessageContents[R]
}

export type MessageRole = "system" | "user" | "assistant" | "tool"

export type MessageContents = {
  system: string
  user: UserContent
  assistant: AssistantContent
  tool: ToolContent
}

export type AssistantContent =
  | string
  | ReadonlyArray<TextPart | FilePart | ReasoningPart | RedactedReasoningPart | ToolCallPart>

export type UserContent = string | Array<TextPart | ImagePart | FilePart>

export type ToolContent = Array<ToolContentPart>
export interface ToolContentPart {
  readonly type: "tool-result"
  readonly toolCallId: string
  readonly toolName: string
  readonly result: unknown
  readonly isError?: boolean
}

export interface TextPart {
  readonly type: "text"
  readonly text: string
}

// TODO: URL?
export type DataContent = string | Uint8Array | ArrayBuffer | Buffer

export interface FilePart {
  type: "file"
  /**
   * File data. Can either be:
   *
   * - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
   * - URL: a URL that points to the image
   */
  readonly data: DataContent | URL
  /** Optional filename of the file.  */
  readonly filename?: string
  /** Mime type of the file.  */
  readonly mimeType: string
}

export interface ReasoningPart {
  readonly type: "reasoning"
  /** The reasoning text. */
  readonly text: string
  /** An optional signature for verifying that the reasoning originated from the model. */
  readonly signature?: string
}

export interface RedactedReasoningPart {
  readonly type: "redacted-reasoning"
  /** Redacted reasoning data. */
  readonly data: string
}

export interface ToolCallPart {
  readonly type: "tool-call"
  /** ID of the tool call. This ID is used to match the tool call with the tool result.  */
  readonly toolCallId: string
  /** Name of the tool that is being called.  */
  readonly toolName: string
  /** Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema. */
  readonly args: unknown
}

export interface ImagePart {
  readonly type: "image"
  readonly image: DataContent | URL
  readonly mimeType?: string
}
