import type { Message } from "../Message.ts"
import type { Falsy } from "../util/Falsy.ts"
import type { Action } from "./Action.ts"

export type ActionLike = Action | Falsy | Array<Message>
