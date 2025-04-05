import type { Action } from "../Action.ts"
import type { ActorLike } from "../Actor.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

export async function takeFirstAction<Y extends Action>(f: ActorLike<Y>): Promise<Y | undefined> {
  const { value } = await unwrapDeferred(f).next()
  return value
}
