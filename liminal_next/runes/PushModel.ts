import type { Provider } from "../Provider.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface PushModel extends RuneBase<"push_model"> {
  provider: Provider
}
