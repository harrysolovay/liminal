import type { Action } from "./Action.js"
import type { Agent } from "../common/Agent.js"

export function* Context<Y extends Action, R = string>(
  system: string,
  implementation?: () => Agent<Y, R>,
): Generator<Context, Awaited<R>> {
  return yield {
    kind: "Context",
    system,
    implementation,
  }
}

export interface Context {
  kind: "Context"
  system: string
  implementation?: () => Agent
}

export interface ContextEvent<E extends Event = Event> {
  type: "Context"
  event: E
}
