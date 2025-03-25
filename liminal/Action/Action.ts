import type { Branch } from "./Branch.js"
import type { V } from "./V.js"
import type { T } from "./T.js"
import type { Messages } from "./Messages.js"
import type { Emit } from "./Emit.js"
import type { LanguageModel } from "./LanguageModel.js"
import type { Context } from "./Context.js"
import type { DisableTool } from "./DisableTool.js"
import type { Falsy } from "../liminal_util/Falsy.js"
import type { Tool } from "./Tool.js"
import type { EmbeddingModel } from "./EmbeddingModel.js"

export type Action =
  | Falsy
  | Context
  | LanguageModel
  | EmbeddingModel
  | Emit
  | Branch
  | string
  | Array<string>
  | T
  | V
  | Tool
  | DisableTool
  | Messages
