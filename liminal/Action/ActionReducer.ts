import type { Scope } from "../Scope/Scope.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import type { ActionLike } from "./ActionLike.ts"

export type ActionReducer<A extends ActionLike = ActionLike> = (action: A, scope: Scope) => PromiseOr<Scope>
