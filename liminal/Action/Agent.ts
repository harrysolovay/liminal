import type { Action } from "./Action.js"
import type { ExtractScope, Scope } from "../Scope.js"
import type { Flow } from "../common/Flow.js"

export function* Agent<K extends string, Y extends Action, R = string>(
  key: K,
  system: string,
  implementation?: () => Flow<Y, R>,
): Generator<Agent<K, ExtractScope<Y, R>>, Awaited<R>> {
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
