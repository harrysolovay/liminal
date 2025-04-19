import type { AgentConfig } from "../AgentConfig.ts"
import type { Runic } from "../Runic.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface Launch<X extends Runic = Runic> extends RuneBase<"launch"> {
  runic: X
  config: AgentConfig
}
