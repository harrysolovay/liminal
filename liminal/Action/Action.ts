import type { Context } from "../Context/Context.js"
import type { DeclareModel } from "../DeclareModel/DeclareModel.js"
import type { DisableTool } from "../DisableTool/DisableTool.js"
import type { Embed } from "../Embed/Embed.js"
import type { Emit } from "../Emit/Emit.js"
import type { EnableTool } from "../EnableTool/EnableTool.js"
import type { Fork } from "../Fork/Fork.js"
import type { Infer } from "../Infer/Infer.js"
import type { Message } from "../Message/Message.js"

export type Action =
  | Context
  | DeclareModel
  | Emit
  | Fork
  | Infer
  | Embed
  | EnableTool
  | DisableTool
  | Message
