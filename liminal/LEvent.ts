import type { EnteredEvent, ExitedEvent, PropagatedEvent } from "./actions/actions_common.ts"
import type { MessageAppendedEvent } from "./actions/AppendMessage.ts"
import type { AwaitResolvedEvent } from "./actions/Await.ts"
import type { ToolDisabledEvent } from "./actions/DisableTool.ts"
import type { EmbeddedEvent, EmbeddingRequestedEvent } from "./actions/Embed.ts"
import type { EmittedEvent } from "./actions/Emit.ts"
import type { ToolCalledEvent, ToolEnabledEvent } from "./actions/EnableTool.ts"
import type { InferenceRequestedEvent, InferredEvent } from "./actions/Infer.ts"
import type { EmbeddingModelSetEvent } from "./actions/SetEmbeddingModel.ts"
import type { LanguageModelSetEvent } from "./actions/SetLanguageModel.ts"
import type { MessagesSetEvent } from "./actions/SetMessages.ts"
import type { ExceptionUncaught } from "./actions/Try.ts"

export type LEvent =
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
  | MessageAppendedEvent
  | MessagesSetEvent
  | PropagatedEvent
  | AwaitResolvedEvent
  | ExceptionUncaught
