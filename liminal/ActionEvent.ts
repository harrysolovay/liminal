import type { EnteredEvent, ExitedEvent } from "./actions/actions_base.ts"
import type { ContextEvent } from "./actions/Context.ts"
import type { ToolDisabledEvent } from "./actions/DisableTool.ts"
import type { EmbeddedEvent, EmbeddingRequestedEvent } from "./actions/Embed.ts"
import type { EmittedEvent } from "./actions/Emit.ts"
import type { ToolCalledEvent, ToolEnabledEvent, ToolEvent } from "./actions/EnableTool.ts"
import type { ForkArmEvent, ForkEvent } from "./actions/Fork.ts"
import type { InferenceRequestedEvent, InferredEvent } from "./actions/Infer.ts"
import type {
  AssistantMessagedEvent,
  SystemMessagedEvent,
  ToolMessagedEvent,
  UserMessagedEvent,
} from "./actions/messages.ts"
import type { EmbeddingModelSetEvent } from "./actions/SetEmbeddingModel.ts"
import type { LanguageModelSetEvent } from "./actions/SetLanguageModel.ts"

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
