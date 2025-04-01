import type { AssistantMessagedEvent } from "../AssistantMessage/AssistantMessageEvent.ts"
import type { ContextEvent } from "../Context/ContextEvent.ts"
import type { ToolDisabledEvent } from "../DisableTool/DisableToolEvent.ts"
import type { EmbeddedEvent, EmbeddingRequestedEvent } from "../Embed/EmbedEvent.ts"
import type { EmittedEvent } from "../Emit/EmitEvent.ts"
import type {
  ToolEnabledEvent,
  ToolEnteredEvent,
  ToolExitedEvent,
  ToolInnerEvent,
} from "../EnableTool/EnableToolEvent.ts"
import type { ExecEnteredEvent, ExecExitedEvent } from "../Exec/ExecEvent.ts"
import type { ForkEvent } from "../Fork/ForkEvent.ts"
import type { InferenceRequestedEvent, InferredEvent } from "../Infer/InferEvent.ts"
import type { EmbeddingModelSetEvent } from "../SetEmbeddingModel/SetEmbeddingModelEvent.ts"
import type { LanguageModelSetEvent } from "../SetLanguageModel/SetLanguageModelEvent.ts"
import type { SystemMessagedEvent } from "../SystemMessage/SystemMessageEvent.ts"
import type { ToolMessagedEvent } from "../ToolMessage/ToolMessageEvent.ts"
import type { UserMessagedEvent } from "../UserMessage/UserMessageEvent.ts"

export type ActionEvent =
  | ExecEnteredEvent
  | ExecExitedEvent
  | ContextEvent
  | ForkEvent
  | ToolEnabledEvent
  | ToolEnteredEvent
  | ToolInnerEvent
  | ToolExitedEvent
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
