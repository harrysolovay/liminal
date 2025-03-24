import type { Branch } from "./Action/Branch.js"
import type { Context } from "./Action/Context.js"
import type { Tool } from "./Action/Tool.js"
import type { AgentLike } from "./common/AgentLike.js"
import type { DeferredOr } from "./liminal_util/DeferredOr.js"

export type AgentSource = AgentLike | DeferredOr<Context | Branch> | Tool
