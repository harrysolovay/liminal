import type { Branch } from "./Branch.js"
import type { Assistant } from "./Assistant.js"
import type { Context } from "./Context.js"
import type { ParentContext } from "./ParentContext.js"
import type { Emit } from "./Emit.js"
import type { Model } from "./Model.js"
import type { Agent } from "./Agent.js"
import type { DisableTool } from "./DisableTool.js"
import type { Falsy } from "../util/Falsy.js"
import type { Tool } from "./Tool.js"

export type Action =
  | Falsy
  | Agent
  | Model
  | Emit
  | Branch
  | string
  | Array<string>
  | Assistant
  | Tool
  | DisableTool
  | Context
  | ParentContext
