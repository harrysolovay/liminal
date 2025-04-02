import { Scope } from "../Scope.ts"
import type { Actor } from "./Actor.ts"

export async function reduce(actor: Actor, scope: Scope): Promise<Scope> {
  let current = await actor.next()
  while (!current.done) {
    const { value } = current
    if (Array.isArray(value)) {
      return scope.spread({
        messages: [...scope.messages, ...value],
        next: undefined,
      })
    } else {
      scope = await value.reduce(scope)
    }
    current = await actor.next(scope.next)
  }
  return scope.spread({
    result: current.value,
    next: undefined,
  })
}
