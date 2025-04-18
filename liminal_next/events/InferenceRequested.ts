import type { Schema } from "../Schema.ts"
import type { LEventBase } from "./_LEventBase.ts"

export interface InferenceRequested extends LEventBase<"inference_requested"> {
  schema?: Schema
}
