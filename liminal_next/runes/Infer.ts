import type { LSchema } from "liminal-schema"
import type { RuneBase } from "./_RuneBase.ts"

export interface Infer extends RuneBase<"infer"> {
  schema: LSchema | undefined
}
