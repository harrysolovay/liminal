import type { Action } from "./Action.js"
import type { ExtractYScope, Scope } from "../Scope.js"
import type { Flow } from "../common/Flow.js"
import type { AgentEvent } from "../Event.js"

export function* Agent<K extends string, Y extends Action, R = string>(
  key: K,
  system: string,
  implementation?: () => Flow<Y, R>,
): Generator<Agent<K, ExtractYScope<Y, R>>, Awaited<R>> {
  return yield {
    "": undefined!,
    kind: "Agent",
    key,
    system,
    implementation,
  }
}

export interface Agent<K extends string = string, S extends Scope = Scope> {
  "": S
  kind: "Agent"
  key: K
  system: string
  implementation?: () => Flow
}

export type ExtractAgentEvent<A extends Agent> = {
  [K in A["key"]]: AgentEvent<K, Extract<A, Agent<K>>[""]["Event"]>
}[A["key"]]
