export type Message = SystemMessage | UserMessage | AssistantMessage | ToolMessage

export interface AssistantMessage extends MessageBase<"assistant", AssistantContent> {}
export type AssistantContent =
  | string
  | Array<TextPart | FilePart | ReasoningPart | RedactedReasoningPart | ToolCallPart>

export interface SystemMessage extends MessageBase<"system", string> {}

export interface UserMessage extends MessageBase<"user", UserContent> {}
export type UserContent = string | Array<TextPart | ImagePart | FilePart>

export interface ToolMessage extends MessageBase<"tool", ToolContent> {}
export type ToolContent = Array<ToolContentPart>
export interface ToolContentPart {
  type: "tool-result"
  toolCallId: string
  toolName: string
  result: unknown
  isError?: boolean
}

export interface TextPart {
  type: "text"
  text: string
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
  data: DataContent | URL
  /** Optional filename of the file.  */
  filename?: string
  /** Mime type of the file.  */
  mimeType: string
}

export interface ReasoningPart {
  type: "reasoning"
  /** The reasoning text. */
  text: string
  /** An optional signature for verifying that the reasoning originated from the model. */
  signature?: string
}

export interface RedactedReasoningPart {
  type: "redacted-reasoning"
  /** Redacted reasoning data. */
  data: string
}

export interface ToolCallPart {
  type: "tool-call"
  /** ID of the tool call. This ID is used to match the tool call with the tool result.  */
  toolCallId: string
  /** Name of the tool that is being called.  */
  toolName: string
  /** Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema. */
  args: unknown
}

export interface ImagePart {
  type: "image"
  image: DataContent | URL
  mimeType?: string
}

interface MessageBase<R extends string, C> {
  role: R
  content: C
}
