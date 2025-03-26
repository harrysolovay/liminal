import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { StateReducers } from "./StateReducers.js"

export const reduceBranch: StateReducers["reduceBranch"] = async function (state, action) {
  const entries = Object.entries(action.branches)
  const result = await Promise.all(
    entries.map(([key, source]) =>
      this.reduceState({
        config: state.config,
        source,
        actor: unwrapDeferred(source),
        languageModelKey: state.languageModelKey,
        embeddingModelKey: state.embeddingModelKey,
        system: state.system,
        next: undefined,
        parent: state,
        handler: (event) =>
          state.handler({
            type: "Branch",
            key: key,
            event,
          }),
        messages: [...state.messages],
        tools: new Set(state.tools),
      }),
    ),
  )
  const next = Array.isArray(action.branches)
    ? result
    : Object.fromEntries(result.map((value, i) => [value, entries[i]]))
  return {
    ...state,
    result,
    next,
  }
}
