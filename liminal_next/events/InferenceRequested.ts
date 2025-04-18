import type { LSchema } from "liminal-schema"
import type { LEventBase } from "./_LEventBase.ts"

export interface InferenceRequested extends LEventBase<"inference_requested"> {
  schema?: LSchema
}
