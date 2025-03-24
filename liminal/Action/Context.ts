import type { Action } from "./Action.js"
import type { ExtractScope, Scope } from "../Scope.js"
import type { Agent } from "../common/Agent.js"

export function* Context<K extends string, Y extends Action, R = string>(
  key: K,
  system: string,
  implementation?: () => Agent<Y, R>,
): Generator<Context<K, ExtractScope<Y, R>>, Awaited<R>> {
  return yield {
    "": undefined!,
    kind: "Context",
    key,
    system,
    implementation,
  }
}

export interface Context<K extends string = string, S extends Scope = Scope> {
  "": S
  kind: "Context"
  key: K
  system: string
  implementation?: () => Agent
}
