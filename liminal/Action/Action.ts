import type { Branch } from "./Branch.js"
import type { Embedding } from "./Embedding.js"
import type { Generation } from "./Generation.js"
import type { CurrentState } from "./CurrentState.js"
import type { Emit } from "./Emit.js"
import type { Model } from "./Model.js"
import type { Context } from "./Context.js"
import type { ToolRemoval } from "./DisableTool.js"
import type { Falsy } from "../util/Falsy.js"
import type { Tool } from "./Tool.js"
import type { ToolMessage } from "./ToolMessage.js"
import type { SystemMessage } from "./SystemMessage.js"
import type { AssistantMessage } from "./AssistantMessage.js"
import type { UserMessage } from "./UserMessage.js"

export type Message = SystemMessage | UserMessage | AssistantMessage | ToolMessage

export type Action =
  | Context
  | Model
  | Emit
  | Branch
  | Generation
  | Embedding
  | Tool
  | ToolRemoval
  | CurrentState
  | Message

export type ActionLike = Action | Falsy | string // TODO:  Array<string | Message>
