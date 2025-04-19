import type { LSchema } from "liminal-schema"

export interface InferenceRequested {
  type: "inference_requested"
  schema?: LSchema
}
