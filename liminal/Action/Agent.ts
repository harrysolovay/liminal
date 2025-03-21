import type { Action } from "./Action.js"
import type { ExtractYScope, Scope } from "../Scope.js"
import type { FlowLike } from "../common/FlowLike.js"
import type { LanguageModelV1 } from "ai"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { Expand } from "../util/Expand.js"

export function Agent<Y extends Action, R>(
  description: string,
  implementation: FlowLike<Y, R>,
): <K extends keyof any>(key: K) => AgentInstance<K, ExtractYScope<K, Y, R>> {
  return <K extends keyof any>(key: K) => ({
    *[Symbol.iterator]() {
      return yield {
        kind: "Agent",
        key,
        scope: undefined!,
        description,
        implementation,
      }
    },
    run: (config) => {
      throw 0
    },
  })
}

export interface AgentInstance<K extends keyof any = keyof any, S extends Scope = Scope>
  extends Iterable<Agent<K, S>, S["Result"]> {
  run: (config: ExecConfig<S>) => Promise<S["Result"]>
}

export interface Agent<K extends keyof any = keyof any, S extends Scope = Scope> {
  kind: "Agent"
  key: K
  scope: S
  description: string
  implementation: FlowLike
}

export type ExecConfig<S extends Scope = Scope> = {
  models: Record<"default" | S["ModelKey"], LanguageModelV1>
  handler?: (event: Expand<S["Event"]>) => PromiseOr<void>
  signal?: AbortSignal
}
