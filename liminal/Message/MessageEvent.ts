import type { AssistantMessageEvent } from "./AssistantMessageEvent.js"
import type { SystemMessageEvent } from "./SystemMessageEvent.js"
import type { ToolMessageEvent } from "./ToolMessageEvent.js"
import type { UserMessageEvent } from "./UserMessageEvent.js"

export type MessageEvent = ToolMessageEvent | UserMessageEvent | SystemMessageEvent | AssistantMessageEvent
