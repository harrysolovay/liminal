import type { ExecState } from "../ExecState.js"
import type { StateReducers } from "./StateReducers.js"

export async function reduceState(this: StateReducers, state: ExecState): Promise<ExecState> {
  state.handler({
    type: "Enter",
  })
  let current = await state.actor.next()
  while (!current.done) {
    const { value } = current
    state = await this.reduceAction(state, value)
    current = await state.actor.next(state.next)
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
