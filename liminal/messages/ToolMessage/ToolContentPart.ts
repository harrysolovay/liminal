export interface ToolContentPart {
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
}
