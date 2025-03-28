import type { EnterEvent, ExitEvent } from "./event_common.js"
import type { BranchEvent, BranchesEvent } from "./Branch.js"
import type { ContextEvent } from "./Context.js"
import type { DisableToolEvent } from "./DisableTool.js"
import type { EmbeddingEvent } from "./Embedding.js"
import type { EmitEvent } from "./Emit.js"
import type { GenerateEvent } from "./Generation.js"
import type { ModelEvent } from "./Model.js"
import type { EnableToolEvent, ToolCallEvent } from "./Tool.js"
import type { UserMessageEvent } from "./UserMessage.js"

export type ActionEvent =
  | EnterEvent
  | ExitEvent
  | BranchEvent
  | BranchesEvent
  | ContextEvent
  | DisableToolEvent
  | EmbeddingEvent
  | EmitEvent
  | GenerateEvent
  | ModelEvent
  | EnableToolEvent
  | ToolCallEvent
  | UserMessageEvent
