import type { Action } from "../Action.ts"
import type { Message } from "../actions/Message.ts"

export type ActionLike = Action | Array<Message>
