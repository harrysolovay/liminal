import type { Branch } from "./Branch.js"
import type { Embedding } from "./Embedding.js"
import type { Generation } from "./Generation.js"
import type { Messages } from "./Messages.js"
import type { UserMessage } from "./UserMessage.js"
import type { Emit } from "./Emit.js"
import type { LanguageModel } from "./LanguageModel.js"
import type { EmbeddingModel } from "./EmbeddingModel.js"
import type { Context } from "./Context.js"
import type { DisableTool } from "./DisableTool.js"
import type { Falsy } from "../util/Falsy.js"
import type { Tool } from "./Tool.js"

export type Action =
  | Falsy
  | Context
  | LanguageModel
  | EmbeddingModel
  | Emit
  | Branch
  | string
  | Array<string>
  | Generation
  | Embedding
  | Tool
  | DisableTool
  | Messages
  | UserMessage
