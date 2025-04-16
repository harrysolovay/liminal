import type { Schema } from "../Schema.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface Reply<T = any> extends RuneBase<"reply"> {
  schema?: Schema<T>
}
