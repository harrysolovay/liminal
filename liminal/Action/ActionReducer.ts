import type { Scope } from "../Scope/Scope.js"
import type { PromiseOr } from "../util/PromiseOr.js"
import type { ActionLike } from "./ActionLike.js"

export type ActionReducer<A extends ActionLike = ActionLike> = (scope: Scope, action: A) => PromiseOr<Scope>
