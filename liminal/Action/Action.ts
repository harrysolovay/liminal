import type { Branch } from "./Branch.js"
import type { T } from "./T.js"
import type { Messages } from "./Messages.js"
import type { Emit } from "./Emit.js"
import type { Model } from "./Model.js"
import type { Context } from "./Context.js"
import type { DisableTool } from "./DisableTool.js"
import type { Falsy } from "../liminal_util/Falsy.js"
import type { Tool } from "./Tool.js"

export type Action =
  | Falsy
  | Context
  | Model
  | Emit
  | Branch
  | string
  | Array<string>
  | T
  | Tool
  | DisableTool
  | Messages
