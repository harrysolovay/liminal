import type { LEvent } from "../LEvent/LEvent.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface Catch<E extends LEvent = LEvent> extends RuneBase<"catch", E> {}
