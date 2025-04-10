import type { Aborted } from "./Aborted.ts"
import type { Embedded } from "./Embedded.ts"
import type { EmbeddingRequested } from "./EmbeddingRequested.ts"
import type { Emitted } from "./Emitted.ts"
import type { Forked } from "./Forked.ts"
import type { InferenceRequested } from "./InferenceRequested.ts"
import type { Inferred } from "./Inferred.ts"
import type { MessageAppended } from "./MessageAppended.ts"
import type { MessageRemoved } from "./MessageRemoved.ts"
import type { MessagesSet } from "./MessagesSet.ts"
import type { ModelPushed } from "./ModelPushed.ts"
import type { ModelRemoved } from "./ModelRemoved.ts"
import type { Returned } from "./Returned.ts"
import type { SectionCleared } from "./SectionCleared.ts"
import type { Sectioned } from "./Sectioned.ts"
import type { Threw } from "./Threw.ts"
import type { ToolCalled } from "./ToolCalled.ts"
import type { ToolDisabled } from "./ToolDisabled.ts"
import type { ToolEnabled } from "./ToolEnabled.ts"

export type LEvent =
  | Embedded
  | EmbeddingRequested
  | Emitted
  | Inferred
  | InferenceRequested
  | MessageAppended
  | MessagesSet
  | Returned
  | Threw
  | ToolCalled
  | ToolDisabled
  | ToolEnabled
  | Aborted
  | MessageRemoved
  | Forked
  | ModelPushed
  | ModelRemoved
  | Sectioned
  | SectionCleared
