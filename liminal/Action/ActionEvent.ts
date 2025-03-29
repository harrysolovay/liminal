import type { BranchEvent, BranchesEvent } from "./Branch.js"
import type { ContextEvent } from "./Context.js"
import type { DisableToolEvent } from "./DisableTool.js"
import type { EmbeddingEvent } from "./Embedding.js"
import type { EmitEvent } from "./Emit.js"
import type { GenerateEvent } from "./Generation.js"
import type { ModelEvent } from "./Model.js"
import type { ToolEvent } from "./Tool.js"
import type { UserMessageEvent } from "./UserMessage.js"
import type { AssistantMessageEvent } from "./AssistantMessage.js"
import type { SystemMessageEvent } from "./SystemMessage.js"
import type { ToolMessageEvent } from "./ToolMessage.js"

export type ActionEvent =
  | ContextEvent
  | BranchesEvent
  | BranchEvent
  | BranchesEvent
  | DisableToolEvent
  | EmbeddingEvent
  | EmitEvent
  | GenerateEvent
  | ModelEvent
  | ToolEvent
  | UserMessageEvent
  | AssistantMessageEvent
  | SystemMessageEvent
  | ToolMessageEvent
