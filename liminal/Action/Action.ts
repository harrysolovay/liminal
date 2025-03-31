import type { Context } from "../Context/Context.ts"
import type { DeclareModel } from "../DeclareModel/DeclareModel.ts"
import type { DisableTool } from "../DisableTool/DisableTool.ts"
import type { Embed } from "../Embed/Embed.ts"
import type { Emit } from "../Emit/Emit.ts"
import type { EnableTool } from "../EnableTool/EnableTool.ts"
import type { Fork } from "../Fork/Fork.ts"
import type { Infer } from "../Infer/Infer.ts"
import type { Message } from "../Message/Message.ts"

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
