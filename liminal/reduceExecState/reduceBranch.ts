import { unwrapDeferred } from "../liminal_util/unwrapDeferred.js"
import type { ActionReducers } from "./ActionReducers.js"
import { reduce } from "./reduceExecState.js"

export const reduceBranch: ActionReducers["reduceBranch"] = async function (state, action) {
  const entries = Object.entries(action.branches)
  const result = await Promise.all(
    entries.map(([key, agentLike]) =>
      reduce(this, {
        models: state.models,
        source: agentLike,
        agent: unwrapDeferred(agentLike),
        modelKey: state.modelKey,
        system: state.system,
        next: undefined,
        parent: state,
        handler: (event) =>
          state.handler({
            type: "Branch",
            branch: key,
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
    next,
  }
}
