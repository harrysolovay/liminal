import type { AssistantMessage } from "./AssistantMessage.js"
import type { SystemMessage } from "./SystemMessage.js"
import type { ToolMessage } from "./ToolMessage.js"
import type { UserMessage } from "./UserMessage.js"

export type Message = SystemMessage | UserMessage | AssistantMessage | ToolMessage
