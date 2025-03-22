import type { Action } from "./Action.js"
import type { ExtractYScope, Scope } from "../Scope.js"
import type { Flow } from "../common/Flow.js"
import type { AgentEvent } from "../Event.js"

export function* Agent<K extends keyof any, Y extends Action, R = string>(
  key: K,
  instructions: string,
  implementation?: () => Flow<Y, R>,
): Generator<Agent<K, ExtractYScope<Y, R>>, Awaited<R>> {
  return yield {
    "": undefined!,
    kind: "Agent",
    key,
    instructions,
    implementation,
  }
}

export interface Agent<K extends keyof any = keyof any, S extends Scope = Scope> {
  "": S
  kind: "Agent"
  key: K
  instructions: string
  implementation?: () => Flow
}

export type ExtractAgentEvent<A extends Agent> = {
  [K in A["key"]]: AgentEvent<K, Extract<A, Agent<K>>[""]["Event"]>
}[A["key"]]
