import type { BranchesEvent } from "../Branches/BranchesEvent.js"
import type { ContextEvent } from "../Context/ContextEvent.js"
import type { EmbeddingEvent } from "../Embedding/EmbeddingEvent.js"
import type { EmissionEvent } from "../Emission/EmitEvent.js"
import type { InferenceEvent } from "../Generation/GenerationEvent.js"
import type { MessageEvent } from "../Message/MessageEvent.js"
import type { ModelEvent } from "../Model/ModelEvent.js"
import type { ToolEvent } from "../Tool/ToolEvent.js"
import type { ToolRemovalEvent } from "../ToolRemoval/ToolRemovalEvent.js"

export type ActionEvent =
  | ContextEvent
  | BranchesEvent
  | BranchesEvent
  | ToolRemovalEvent
  | EmbeddingEvent
  | EmissionEvent
  | InferenceEvent
  | ModelEvent
  | ToolEvent
  | MessageEvent
