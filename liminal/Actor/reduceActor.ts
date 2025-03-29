import { State } from "../State/State.js"
import { reduceAction } from "../Action/reduceAction.js"

export async function reduceActor(state: State): Promise<State> {
  let current = await state.actor.next()
  while (!current.done) {
    const { value } = current
    state = await reduceAction(state, value)
    current = await state.actor.next(state.next)
  }
  return State({
    ...state,
    next: undefined,
    result: current.value,
  })
}
