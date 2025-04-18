import type { LEvent } from "../LEvent/LEvent.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface Branch<E extends LEvent = LEvent> extends RuneBase<"branch", E> {}
