import { reduceAction } from "../Action/reduceAction.ts"
import { Scope } from "../Scope/Scope.ts"

export async function reduceActor(scope: Scope): Promise<Scope> {
  let current = await scope.actor.next()
  while (!current.done) {
    const { value } = current
    scope = await reduceAction(scope, value)
    current = await scope.actor.next(scope.next)
  }
  return scope.spread({
    result: current.value,
    next: undefined,
  })
}
