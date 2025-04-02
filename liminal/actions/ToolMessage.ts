import type { Spec } from "../Spec.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"

export interface ToolMessage<S extends Spec = Spec> extends ActionBase<"tool_message", S> {
  content: Array<ToolContentPart>
}

export function* toolMessage(content: Array<ToolContentPart>): Generator<
  ToolMessage<{
    Entry: never
    Event: ToolMessagedEvent
  }>,
  void
> {
  return yield ActionBase("tool_message", {
    content,
    reduce(scope) {
      scope.events.emit({
        type: "tool_messaged",
        content,
      })
      return scope.spread({
        messages: [...scope.messages, this as never],
        next: undefined,
      })
    },
  })
}

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

export interface ToolMessagedEvent extends ActionEventBase<"tool_messaged"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: Array<ToolContentPart>
}
