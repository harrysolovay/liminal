import type { ExecState } from "../ExecState.js"
import type { StateReducers } from "./StateReducers.js"

export async function reduceState(this: StateReducers, state: ExecState): Promise<ExecState> {
  if (state.config.signal?.aborted) {
    return {
      ...state,
      next: undefined,
      aborted: true,
    }
  }
  state.handler({
    event: "Enter",
  })
  let current = await state.actor.next()
  while (!current.done) {
    const { value } = current
    state = await this.reduceAction(state, value)
    if (state.config.signal?.aborted) {
      return {
        ...state,
        next: undefined,
        aborted: true,
      }
    }
    current = await state.actor.next(state.next)
  }
  const { value } = current
  state.handler({
    event: "Exit",
    result: value,
  })
  return {
    ...state,
    next: undefined,
    result: value,
  }
}
