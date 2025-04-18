import type { InferenceRequested } from "../events/InferenceRequested.ts"
import type { Inferred } from "../events/Inferred.ts"
import type { Schema } from "../Schema.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface Infer extends RuneBase<"infer", InferenceRequested | Inferred> {
  schema?: Schema
}
