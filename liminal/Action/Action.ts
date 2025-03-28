import type { Branch } from "./Branch.js"
import type { Embedding } from "./Embedding.js"
import type { Generation } from "./Generation.js"
import type { Messages } from "./Messages.js"
import type { UserMessage } from "./UserMessage.js"
import type { Emit } from "./Emit.js"
import type { Model } from "./Model.js"
import type { Context } from "./Context.js"
import type { DisableTool } from "./DisableTool.js"
import type { Falsy } from "../util/Falsy.js"
import type { Tool } from "./Tool.js"

export type Action =
  | Context
  | Model
  | Emit
  | Branch
  | Generation
  | Embedding
  | Tool
  | DisableTool
  | Messages
  | UserMessage

export type ActionLike = Action | Falsy | string | Array<string>
