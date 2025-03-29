import type { CurrentContextDetails } from "../Action/CurrentContext.js"
import type { StateReducers } from "./StateReducers.js"

export const reduceCurrentContext: StateReducers["reduceCurrentContext"] = (state) => {
  return {
    ...state,
    next: {
      system: state.system,
      messages: [...state.messages],
      tools: [...state.tools].map((tool) => tool.key),
    } satisfies CurrentContextDetails,
  }
}
