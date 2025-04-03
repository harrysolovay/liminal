import type { Spec } from "../Spec.ts"
import { fixTemplateStrings } from "../util/fixTemplateStrings.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"
import type {
  FilePart,
  ImagePart,
  ReasoningPart,
  RedactedReasoningPart,
  TextPart,
  ToolCallPart,
} from "./content_part.ts"

export type Message = SystemMessage | UserMessage | AssistantMessage | ToolMessage

// Shared base types
type MessageType = "assistant_message" | "system_message" | "user_message" | "tool_message"
type MessageEventType = "assistant_messaged" | "system_messaged" | "user_messaged" | "tool_messaged"

interface BaseMessage<T extends MessageType, C, S extends Spec = Spec> extends ActionBase<T, S> {
  content: C
}

interface BaseMessagedEvent<T extends MessageEventType, C> extends ActionEventBase<T> {
  content: C
}

const messageFn = <
  TMessage extends BaseMessage<any, any, { Entry: any; Event: BaseMessagedEvent<any, any> }>,
>(
  messageType: TMessage["action"],
  eventType: TMessage[""]["Event"]["type"],
) =>
  function*(
    ...[raw, ...substitutions]: [content: TMessage["content"]] | [
      raw: TemplateStringsArray,
      ...substitutions: Array<string>,
    ]
  ): Generator<TMessage, void> {
    const content = raw instanceof Object && "raw" in raw && Array.isArray(raw.raw)
      ? String.raw(fixTemplateStrings(raw as TemplateStringsArray), ...substitutions)
      : raw as TMessage["content"]
    // @ts-ignore, you can't please everyone
    return yield ActionBase(messageType, {
      content,
      reduce(scope) {
        scope.events.emit({ type: eventType, content })
        return scope.spread({ messages: [...scope.messages, this as never], next: undefined })
      },
    })
  }

export type AssistantContent =
  | string
  | Array<TextPart | FilePart | ReasoningPart | RedactedReasoningPart | ToolCallPart>
export interface AssistantMessage<S extends Spec = Spec>
  extends BaseMessage<"assistant_message", AssistantContent, S>
{}
export interface AssistantMessagedEvent extends BaseMessagedEvent<"assistant_messaged", AssistantContent> {}
export const assistant = (messageFn<AssistantMessage<{ Entry: never; Event: AssistantMessagedEvent }>>)(
  "assistant_message",
  "assistant_messaged",
)

export interface SystemMessage<S extends Spec = Spec> extends BaseMessage<"system_message", string, S> {}
export interface SystemMessagedEvent extends BaseMessagedEvent<"system_messaged", string> {}
export const system = (messageFn<SystemMessage<{ Entry: never; Event: SystemMessagedEvent }>>)(
  "system_message",
  "system_messaged",
)

export type UserContent = string | Array<TextPart | ImagePart | FilePart>
export interface UserMessage<S extends Spec = Spec> extends BaseMessage<"user_message", UserContent, S> {}
export interface UserMessagedEvent extends BaseMessagedEvent<"user_messaged", UserContent> {}
export const user = (messageFn<UserMessage<{ Entry: never; Event: UserMessagedEvent }>>)(
  "user_message",
  "user_messaged",
)

export interface ToolContentPart {
  type: "tool-result"
  toolCallId: string
  toolName: string
  result: unknown
  isError?: boolean
}

export interface ToolMessage<S extends Spec = Spec> extends BaseMessage<"tool_message", Array<ToolContentPart>, S> {}
export interface ToolMessagedEvent extends BaseMessagedEvent<"tool_messaged", Array<ToolContentPart>> {}
export function* toolMessage(
  content: Array<ToolContentPart>,
): Generator<ToolMessage<{ Entry: never; Event: ToolMessagedEvent }>, void> {
  return yield ActionBase("tool_message", {
    content,
    reduce(scope) {
      scope.events.emit({ type: "tool_messaged", content })
      return scope.spread({ messages: [...scope.messages, this as never], next: undefined })
    },
  })
}
