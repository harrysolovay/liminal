import type { AssistantMessage } from "./AssistantMessage.ts"
import type { SystemMessage } from "./SystemMessage.ts"
import type { ToolMessage } from "./ToolMessage.ts"
import type { UserMessage } from "./UserMessage.ts"

export type Message = SystemMessage | UserMessage | AssistantMessage | ToolMessage
