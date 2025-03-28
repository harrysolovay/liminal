import type { Branch } from "./Branch.js"
import type { Embedding } from "./Embedding.js"
import type { Generation } from "./Generation.js"
import type { CurrentContext } from "./CurrentContext.js"
import type { Emit } from "./Emit.js"
import type { Model } from "./Model.js"
import type { Context } from "./Context.js"
import type { DisableTool } from "./DisableTool.js"
import type { Falsy } from "../util/Falsy.js"
import type { Tool } from "./Tool.js"
import type { Message } from "../Message.js"

export type Action = Context | Model | Emit | Branch | Generation | Embedding | Tool | DisableTool | CurrentContext

export type ActionLike = Action | Falsy | string | Message | Array<string | Message>
