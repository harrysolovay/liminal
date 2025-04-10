import type { IsExact } from "conditional-type-checks"
import type { Action } from "../Action.ts"
import type { AgentLike } from "../Agent.ts"
import type { Spec } from "../Spec.ts"
import type { Expand } from "../util/Expand.ts"

export interface AgentAssertions<S extends Spec> {
  assertSpec<A extends Spec>(
    ...[passes]: IsExact<S, Expand<A>> extends true ? [passes?: true] : [passes: false]
  ): void
}

export function AgentAssertions<Y extends Action, R>(_agentLike: AgentLike<Y, R>): AgentAssertions<Y[""]> {
  return {
    assertSpec: () => {},
  }
}
