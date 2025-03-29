import { ExecState } from "../ExecState.js"
import type { StateReducers } from "./StateReducers.js"

export async function reduceActor(stateReducers: StateReducers, state: ExecState): Promise<ExecState> {
  let current = await state.actor.next()
  while (!current.done) {
    const { value } = current
    state = await stateReducers.reduceAction(state, value)
    current = await state.actor.next(state.next)
  }
  return ExecState({
    ...state,
    next: undefined,
    result: current.value,
  })
}
