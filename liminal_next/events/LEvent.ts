import type { Emitted } from "./Emitted.ts"
import type { InferenceRequested } from "./InferenceRequested.ts"
import type { Inferred } from "./Inferred.ts"
import type { MessageAppended } from "./MessageAppended.ts"
import type { Propagated } from "./Propagated.ts"

export type LEvent = Emitted | Propagated | MessageAppended | InferenceRequested | Inferred
