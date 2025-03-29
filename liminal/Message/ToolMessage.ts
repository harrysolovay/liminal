import type { Spec } from "../Spec.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { EventBase } from "../Action/ActionEventBase.js"

export interface ToolMessage<S extends Spec = Spec> extends ActionBase<"ToolMessage", S> {
  content: Array<ToolMessageContentPart>
}

export interface ToolMessageContentPart {
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

export interface ToolMessageEvent extends EventBase<"ToolMessage"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: Array<ToolMessageContentPart>
}

export function* ToolMessage(content: Array<ToolMessageContentPart>): Generator<
  ToolMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: ToolMessageEvent
  }>,
  void
> {
  return yield ActionBase("ToolMessage", { content })
}
