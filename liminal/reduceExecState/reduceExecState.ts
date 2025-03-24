import type { ExecState } from "../ExecState.js"
import type { ActionReducers } from "./ActionReducers.js"

export async function reduceExecState(reducers: ActionReducers, state: ExecState): Promise<ExecState> {
  state.handler({
    type: "Enter",
  })
  let current = await state.agent.next()
  while (!current.done) {
    const { value } = current
    state = await reducers.reduceAction(state, value)
    current = await state.agent.next(state.next)
  }
  const { value } = current
  state.handler({
    type: "Exit",
    result: value,
  })
  return {
    ...state,
    next: undefined,
    result: value,
  }
}
