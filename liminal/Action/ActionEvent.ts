import type { BranchesEvent, BranchArmEvent } from "../Branch/Branch.js"
import type { ContextEvent } from "../Context/ContextEvent.js"
import type { EmbeddingEvent } from "../Embedding/EmbeddingEvent.js"
import type { EmitEvent } from "../Emit/EmitEvent.js"
import type { GenerationEvent } from "../Generation/GenerationEvent.js"
import type { MessageEvent } from "../Message/MessageEvent.js"
import type { ModelEvent } from "../Model/ModelEvent.js"
import type { ToolEvent } from "../Tool/ToolEvent.js"
import type { ToolRemovalEvent } from "../ToolRemoval/ToolRemovalEvent.js"

export type ActionEvent =
  | ContextEvent
  | BranchesEvent
  | BranchArmEvent
  | BranchesEvent
  | ToolRemovalEvent
  | EmbeddingEvent
  | EmitEvent
  | GenerationEvent
  | ModelEvent
  | ToolEvent
  | MessageEvent
