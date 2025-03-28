export function* Message(text: string): Generator<Message, undefined> {
  return yield normalizeMessageLike(text)
}

export function normalizeMessageLike(messageLike: string | Message): Message {
  if (typeof messageLike === "string") {
    return {
      role: "user",
      content: messageLike,
    }
  }
  return messageLike
}

export type Message =
  | {
      role: "system"
      content: string
    }
  | {
      role: "user"
      content: string | Array<TextPart | ImagePart | FilePart>
    }
  | {
      role: "assistant"
      content: string | Array<TextPart | FilePart | ReasoningPart | RedactedReasoningPart | ToolCallPart>
    }
  | {
      role: "tool"
      content: Array<{
        type: "tool-result"
        /** ID of the tool call that this result is associated with. */
        toolCallId: string
        /** Name of the tool that generated this result. */
        toolName: string
        /** Result of the tool call. This is a JSON-serializable object. */
        result: unknown
        // /** Multi-part content of the tool result. Only for tools that support multipart results. */
        // experimental_content?: ToolResultContent
        /** Optional flag if the result is an error or an error message.  */
        isError?: boolean
      }>
    }

interface TextPart {
  type: "text"
  text: string
}

interface ImagePart {
  type: "image"
  /**
   * Image data. Can either be:
   * - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
   * - URL: a URL that points to the image
   */
  image: DataContent | URL
  /** Optional mime type of the image. */
  mimeType?: string
}

type DataContent = string | Uint8Array | ArrayBuffer | Buffer

interface FilePart {
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

interface ReasoningPart {
  type: "reasoning"
  /** The reasoning text. */
  text: string
  /** An optional signature for verifying that the reasoning originated from the model. */
  signature?: string
}

interface RedactedReasoningPart {
  type: "redacted-reasoning"
  /** Redacted reasoning data. */
  data: string
}

interface ToolCallPart {
  type: "tool-call"
  /** ID of the tool call. This ID is used to match the tool call with the tool result.  */
  toolCallId: string
  /** Name of the tool that is being called.  */
  toolName: string
  /** Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema. */
  args: unknown
}
