import type { Emitted } from "./Emitted.ts"
import type { MessageAppended } from "./MessageAppended.ts"
import type { Propagated } from "./Propagated.ts"

export type LEvent = Emitted | Propagated | MessageAppended
