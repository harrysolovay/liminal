import type { Adapter } from "../Provider.ts"
import type { Reference } from "../Reference.ts"
import type { LEventBase } from "./_LEventBase.ts"

export interface ModelRemoved extends LEventBase<"model_removed"> {
  model: Reference<Adapter>
}
