import type { Action } from "./Action/Action.js"
import type { Tool } from "./Action/Tool.js"
import { StateReducers } from "./StateReducers/StateReducers.js"
import type { Adapter } from "./Adapter.js"
import type { ActorLike } from "./common/ActorLike.js"
import type { ExecConfig } from "./ExecConfig.js"
import type { ExecState } from "./ExecState.js"
import { unwrapDeferred } from "./util/unwrapDeferred.js"
import type { ExecSpec } from "./ExecSpec.js"

export function Exec<S extends ExecSpec>(adapter: Adapter<S>): Exec<S> {
  return {
    run: async (agent, config) => {
      const reducers = StateReducers(adapter.providerReducers)
      const state: ExecState<S> = {
        config,
        source: agent,
        actor: unwrapDeferred(agent),
        languageModelKey: "default",
        embeddingModelKey: config.models.embedding?.default,
        system: undefined,
        next: undefined,
        parent: undefined,
        handler: config.handler as never,
        messages: [],
        tools: new Set<Tool>(),
      }
      return (await reducers.reduceState(state)) as never
    },
  }
}

export interface Exec<S extends ExecSpec> {
  run: <Y extends Action, R>(agent: ActorLike<Y, R>, config: ExecConfig<S>) => Promise<unknown>
}
