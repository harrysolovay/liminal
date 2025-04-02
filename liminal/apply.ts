import type { ActionLike } from "./Action/ActionLike.ts"
import type { ActorLike } from "./Actor/ActorLike.ts"
import { reduceActor } from "./Actor/reduceActor.ts"
import { Events } from "./Events.ts"
import type { Exec } from "./Exec/Exec.ts"
import { Scope } from "./Scope/Scope.ts"
import type { ExtractSpec, Spec } from "./Spec.ts"
import type { U2I } from "./util/U2I.ts"
import { unwrapDeferred } from "./util/unwrapDeferred.ts"

export function apply<Y extends ActionLike, T, S extends ExtractSpec<Y>>(
  actorLike: ActorLike<Y, T>,
  args: U2I<S["Field"]>,
): Exec<S, T> {
  return {
    exec: async (handler) => {
      const actor = unwrapDeferred(actorLike)
      let scope = new Scope(args as never, undefined, new Events((inner) => inner, handler))
      scope.events.emit({
        type: "exec_entered",
      })
      scope = await reduceActor(actor, scope)
      scope.events.emit({
        type: "exec_exited",
        result: scope.result,
      })
      return scope
    },
  }
}
