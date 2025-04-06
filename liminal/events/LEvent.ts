import type { AbortedEvent } from "./AbortedEvent.ts"
import type { EmbeddedEvent } from "./EmbeddedEvent.ts"
import type { EmbeddingModelSetEvent } from "./EmbeddingModelSetEvent.ts"
import type { EmbeddingRequestedEvent } from "./EmbeddingRequestedEvent.ts"
import type { EmittedEvent } from "./EmittedEvent.ts"
import type { InferenceRequestedEvent } from "./InferenceRequestedEvent.ts"
import type { InferredEvent } from "./InferredEvent.ts"
import type { LanguageModelSetEvent } from "./LanguageModelSetEvent.ts"
import type { MessageAppendedEvent } from "./MessageAppendedEvent.ts"
import type { MessageRemovedEvent } from "./MessageRemovedEvent.ts"
import type { MessagesSetEvent } from "./MessagesSetEvent.ts"
import type { PropagatedEvent } from "./PropagatedEvent.ts"
import type { ReturnedEvent } from "./ReturnedEvent.ts"
import type { ThrownEvent } from "./ThrownEvent.ts"
import type { ToolCalledEvent } from "./ToolCalledEvent.ts"
import type { ToolDisabledEvent } from "./ToolDisabledEvent.ts"
import type { ToolEnabledEvent } from "./ToolEnabledEvent.ts"

export type LEvent =
  | EmbeddedEvent
  | EmbeddingModelSetEvent
  | EmbeddingRequestedEvent
  | EmittedEvent
  | InferredEvent
  | InferenceRequestedEvent
  | LanguageModelSetEvent
  | MessageAppendedEvent
  | MessagesSetEvent
  | PropagatedEvent
  | ReturnedEvent
  | ThrownEvent
  | ToolCalledEvent
  | ToolDisabledEvent
  | ToolEnabledEvent
  | AbortedEvent
  | MessageRemovedEvent
