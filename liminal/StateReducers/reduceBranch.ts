import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { StateReducers } from "./StateReducers.js"

export const reduceBranch: StateReducers["reduceBranch"] = async function (state, action) {
  const entries = Object.entries(action.branches)
  const result = await Promise.all(
    entries.map(([key, source]) => {
      return this.reduceState(
        {
          config: state.config,
          source,
          actor: unwrapDeferred(source),
          languageModelKey: state.languageModelKey,
          embeddingModelKey: state.embeddingModelKey,
          system: state.system,
          next: undefined,
          parent: state,
          handler: (inner) =>
            state.handler({
              event: "Branch",
              key,
              inner,
            }),
          messages: [...state.messages],
          tools: new Set(state.tools),
        },
        null!,
      )
    }),
  )
  const next = Array.isArray(action.branches)
    ? result.map((state) => state.result)
    : Object.fromEntries(entries.map(([key], i) => [key, result[i]!.result]))
  return { ...state, next }
}
