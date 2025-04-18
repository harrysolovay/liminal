import type { Adapter } from "../Adapter.ts"
import type { Reference } from "../Reference.ts"
import type { LEventBase } from "./_LEventBase.ts"

export interface ModelPushed extends LEventBase<"model_pushed"> {
  model: Reference<Adapter>
}
