import type { FilePart, ReasoningPart, RedactedReasoningPart, TextPart, ToolCallPart } from "../content_part.ts"

export type AssistantContent =
  | string
  | Array<TextPart | FilePart | ReasoningPart | RedactedReasoningPart | ToolCallPart>
