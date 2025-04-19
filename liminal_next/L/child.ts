import type { Agent } from "../Agent.ts"
import type { AgentConfig } from "../AgentConfig.ts"
import { RuneBase } from "../runes/_RuneBase.ts"
import type { Launch } from "../runes/Launch.ts"
import type { Runic } from "../Runic.ts"

export interface agent<X extends Runic> extends Iterable<Launch, Agent<Runic.T<X>, never>> {}

export function agent<X extends Runic>(runic: X, config: AgentConfig): agent<X> {
  return {
    *[Symbol.iterator](): Generator<Launch, Agent<Runic.T<X>, never>> {
      return yield RuneBase("launch", { runic, config })
    },
  }
}
