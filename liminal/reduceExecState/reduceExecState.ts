import type { ExecState } from "../ExecState.js"
import type { ActionReducers } from "./ActionReducers.js"

export async function reduce(reducers: ActionReducers, state: ExecState): Promise<ExecState> {
  state.handler({
    type: "Enter",
  })
  let current = await state.agent.next()
  while (!current.done) {
    const { value } = current
    state = await reducers.reduceAction(state, value)
    current = await state.agent.next(state.next)
  }
  state.handler({
    type: "Exit",
    result: current.value,
  })
  return {
    ...state,
    result: current.value,
  }
}
