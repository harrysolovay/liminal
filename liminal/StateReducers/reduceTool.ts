import { toJSONSchema } from "standard-json-schema"
import type { StateReducers } from "./StateReducers.js"

export const reduceTool: StateReducers["reduceTool"] = (state, action) => {
  state.handler({
    type: "EnableTool",
    key: action.key,
    description: action.description,
    schema: toJSONSchema(action.params),
  })
  return {
    ...state,
    tools: new Set([...state.tools, action]),
    next: function* () {
      yield {
        kind: "DisableTool",
        tool: action,
      }
    },
  }
}
