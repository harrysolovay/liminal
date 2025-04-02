import type { ContextEvent } from "../Context/ContextEvent.ts"
import type { ToolDisabledEvent } from "../DisableTool/DisableToolEvent.ts"
import type { EmbeddedEvent, EmbeddingRequestedEvent } from "../Embed/EmbedEvent.ts"
import type { EmittedEvent } from "../Emit/EmitEvent.ts"
import type { ToolCalledEvent, ToolEnabledEvent, ToolEvent } from "../EnableTool/EnableToolEvent.ts"
import type { ForkArmEvent, ForkEvent } from "../Fork/ForkEvent.ts"
import type { InferenceRequestedEvent, InferredEvent } from "../Infer/InferEvent.ts"
import type { AssistantMessagedEvent } from "../messages/AssistantMessage/AssistantMessageEvent.ts"
import type { SystemMessagedEvent } from "../messages/SystemMessage/SystemMessageEvent.ts"
import type { ToolMessagedEvent } from "../messages/ToolMessage/ToolMessageEvent.ts"
import type { UserMessagedEvent } from "../messages/UserMessage/UserMessageEvent.ts"
import type { EmbeddingModelSetEvent } from "../SetEmbeddingModel/SetEmbeddingModelEvent.ts"
import type { LanguageModelSetEvent } from "../SetLanguageModel/SetLanguageModelEvent.ts"
import type { EnteredEvent, ExitedEvent } from "./ActionEventBase.ts"

export type ActionEvent =
  | EnteredEvent
  | ExitedEvent
  | ContextEvent
  | ForkEvent
  | ForkArmEvent
  | ToolEnabledEvent
  | ToolCalledEvent
  | ToolEvent
  | ToolDisabledEvent
  | EmbeddingRequestedEvent
  | EmbeddedEvent
  | EmittedEvent
  | InferenceRequestedEvent
  | InferredEvent
  | EmbeddingModelSetEvent
  | LanguageModelSetEvent
  | SystemMessagedEvent
  | UserMessagedEvent
  | AssistantMessagedEvent
  | ToolMessagedEvent
