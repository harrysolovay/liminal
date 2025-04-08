import type { EventScope } from "../EventScope.ts"
import type { Aborted } from "./Aborted.ts"
import type { Embedded } from "./Embedded.ts"
import type { EmbeddingModelSet } from "./EmbeddingModelSet.ts"
import type { EmbeddingRequested } from "./EmbeddingRequested.ts"
import type { Emitted } from "./Emitted.ts"
import type { InferenceRequested } from "./InferenceRequested.ts"
import type { Inferred } from "./Inferred.ts"
import type { LanguageModelSet } from "./LanguageModelSet.ts"
import type { MessageAppended } from "./MessageAppended.ts"
import type { MessageRemoved } from "./MessageRemoved.ts"
import type { MessagesSet } from "./MessagesSet.ts"
import type { Returned } from "./Returned.ts"
import type { Threw } from "./Threw.ts"
import type { ToolCalled } from "./ToolCalled.ts"
import type { ToolDisabled } from "./ToolDisabled.ts"
import type { ToolEnabled } from "./ToolEnabled.ts"

export type LEvent =
  | Embedded
  | EmbeddingModelSet
  | EmbeddingRequested
  | Emitted
  | Inferred
  | InferenceRequested
  | LanguageModelSet
  | MessageAppended
  | MessagesSet
  | EventScope
  | Returned
  | Threw
  | ToolCalled
  | ToolDisabled
  | ToolEnabled
  | Aborted
  | MessageRemoved
