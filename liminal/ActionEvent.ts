import type { ChildEvent, EnteredEvent, ExitedEvent } from "./actions/actions_common.ts"
import type { AwaitedEvent } from "./actions/Await.ts"
import type { ToolDisabledEvent } from "./actions/DisableTool.ts"
import type { EmbeddedEvent, EmbeddingRequestedEvent } from "./actions/Embed.ts"
import type { EmittedEvent } from "./actions/Emit.ts"
import type { ToolCalledEvent, ToolEnabledEvent } from "./actions/EnableTool.ts"
import type { InferenceRequestedEvent, InferredEvent } from "./actions/Infer.ts"
import type {
  AssistantMessagedEvent,
  SystemMessagedEvent,
  ToolMessagedEvent,
  UserMessagedEvent,
} from "./actions/messages.ts"
import type { EmbeddingModelSetEvent } from "./actions/SetEmbeddingModel.ts"
import type { LanguageModelSetEvent } from "./actions/SetLanguageModel.ts"
import type { MessagesSetEvent } from "./actions/SetMessages.ts"

export type ActionEvent =
  | EnteredEvent
  | ExitedEvent
  | ToolEnabledEvent
  | ToolCalledEvent
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
  | MessagesSetEvent
  | ChildEvent
  | AwaitedEvent
