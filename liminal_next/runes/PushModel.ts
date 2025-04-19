import type { Model } from "../Model.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface PushModel extends RuneBase<"push_model"> {
  provider: Model
}
