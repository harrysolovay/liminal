import type { LiminalEvent } from "../LiminalEvent.js"
import type { Spec } from "../Spec.js"
import type { Action } from "../Action/Action.js"
import type { FlowLike } from "../common/FlowLike.js"
import type { DeferredOr } from "../util/DeferredOr.js"
import type { LanguageModelV1 } from "ai"

// biome-ignore lint/correctness/useYield: <explanation>
export async function* Exec<Y extends Action, T, S extends Spec<"root", Y, T>>(
  flow: DeferredOr<FlowLike<Y, T>>,
  config: ExecConfig<"default">,
): Exec<S> {
  throw 0
}

export interface Exec<S extends Spec = Spec> extends AsyncIterable<LiminalEvent<S>, void> {}

export interface ExecConfig<M extends keyof any> {
  models: {
    [K in M]: LanguageModelV1
  }
}
