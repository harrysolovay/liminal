import { reduceAction } from "../Action/reduceAction.ts"
import { Scope } from "../Scope/Scope.ts"
import type { Actor } from "./Actor.ts"

export async function reduceActor(actor: Actor, scope: Scope): Promise<Scope> {
  let current = await actor.next()
  while (!current.done) {
    const { value } = current
    scope = await reduceAction(value, scope)
    current = await actor.next(scope.next)
  }
  return scope.spread({
    result: current.value,
    next: undefined,
  })
}
