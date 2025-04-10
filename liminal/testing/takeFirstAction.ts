import type { Action } from "../Action.ts"
import type { AgentLike } from "../Agent.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

export async function takeFirstAction<Y extends Action>(f: AgentLike<Y>): Promise<Y | undefined> {
  const { value } = await unwrapDeferred(f).next()
  return value
}
