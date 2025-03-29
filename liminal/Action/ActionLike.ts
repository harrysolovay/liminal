import type { Falsy } from "../util/Falsy.js"
import type { Action } from "./Action.js"

export type ActionLike = Action | Falsy | string // TODO:  Array<string | Message>
