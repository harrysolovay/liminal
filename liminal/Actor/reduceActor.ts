import { reduceAction } from "../Action/reduceAction.js"
import { State } from "../State/State.js"

export async function reduceActor(state: State): Promise<State> {
  let current = await state.actor.next()
  while (!current.done) {
    const { value } = current
    state = await reduceAction(state, value)
    current = await state.actor.next(state.next)
  }
  // TODO: quadruple-check this behavior
  state.result = current.value
  state.next = undefined
  return state
}
