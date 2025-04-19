import type { AgentCreated } from "./AgentCreated.ts"
import type { Emitted } from "./Emitted.ts"
import type { InferenceRequested } from "./InferenceRequested.ts"
import type { Inferred } from "./Inferred.ts"
import type { MessageAppended } from "./MessageAppended.ts"
import type { ModelPushed } from "./ModelPushed.ts"
import type { ModelRemoved } from "./ModelRemoved.ts"
import type { Propagated } from "./Propagated.ts"
import type { Resolved } from "./Resolved.ts"

export type LEvent =
  | Emitted
  | InferenceRequested
  | Inferred
  | MessageAppended
  | ModelPushed
  | ModelRemoved
  | Propagated
  | Resolved
  | AgentCreated
