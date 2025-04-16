import type { Schema } from "../Schema.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface Stream<T = any> extends RuneBase<"stream"> {
  schema?: Schema<T>
}
