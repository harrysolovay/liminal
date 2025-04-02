import type { AssistantMessage } from "./AssistantMessage/AssistantMessage.ts"
import type { SystemMessage } from "./SystemMessage/SystemMessage.ts"
import type { ToolMessage } from "./ToolMessage/ToolMessage.ts"
import type { UserMessage } from "./UserMessage/UserMessage.ts"

export type Message = SystemMessage | UserMessage | AssistantMessage | ToolMessage
