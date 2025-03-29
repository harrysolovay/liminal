import type { BranchesEvent, BranchEvent } from "../Branch/Branch.js"
import type { ContextEvent } from "../Context/Context.js"
import type { EmbeddingEvent } from "../Embedding/Embedding.js"
import type { EmitEvent } from "../Emit/Emit.js"
import type { GenerateEvent } from "../Generation/Generation.js"
import type { AssistantMessageEvent } from "../Message/AssistantMessage.js"
import type { SystemMessageEvent } from "../Message/SystemMessage.js"
import type { ToolMessageEvent } from "../Message/ToolMessage.js"
import type { UserMessageEvent } from "../Message/UserMessage.js"
import type { ModelEvent } from "../Model/Model.js"
import type { ToolEvent } from "../Tool/Tool.js"
import type { ToolRemovalEvent } from "../ToolRemoval/ToolRemoval.js"

export type ActionEvent =
  | ContextEvent
  | BranchesEvent
  | BranchEvent
  | BranchesEvent
  | ToolRemovalEvent
  | EmbeddingEvent
  | EmitEvent
  | GenerateEvent
  | ModelEvent
  | ToolEvent
  | UserMessageEvent
  | AssistantMessageEvent
  | SystemMessageEvent
  | ToolMessageEvent
