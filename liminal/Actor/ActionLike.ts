import type { Action } from "../Action.ts"
import type { Message } from "../actions/messages.ts"

export type ActionLike = Action | Array<Message>
