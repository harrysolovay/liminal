import type { Agent } from "../Agent.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface Join extends RuneBase<"join"> {
  agents: Array<Agent>
}
