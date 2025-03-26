import type { Branch } from "../Action/Branch.js"
import type { Context } from "../Action/Context.js"
import type { Scope } from "../Action/Scope.js"
import type { Tool } from "../Action/Tool.js"
import type { ActorLike } from "./ActorLike.js"
import type { DeferredOr } from "../util/DeferredOr.js"

export type ActorSource = ActorLike | DeferredOr<Context | Branch | Scope> | Tool
