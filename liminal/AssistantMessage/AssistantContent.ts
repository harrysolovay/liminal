import type { FilePart, ReasoningPart, RedactedReasoningPart, TextPart, ToolCallPart } from "../Message/content_part.ts"

export type AssistantContent =
  | string
  | Array<TextPart | FilePart | ReasoningPart | RedactedReasoningPart | ToolCallPart>
