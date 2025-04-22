import type { LArray } from "./LArray"
import type { LInteger } from "./LInteger"
import type { LString } from "./LString"

export type LType = LString | LInteger | LArray<LType>
