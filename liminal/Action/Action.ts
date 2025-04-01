import type { Context } from "../Context/Context.ts"
import type { DisableTool } from "../DisableTool/DisableTool.ts"
import type { Embed } from "../Embed/Embed.ts"
import type { Emit } from "../Emit/Emit.ts"
import type { EnableTool } from "../EnableTool/EnableTool.ts"
import type { Fork } from "../Fork/Fork.ts"
import type { Infer } from "../Infer/Infer.ts"
import type { Message } from "../Message/Message.ts"
import type { SetEmbeddingModel } from "../SetEmbeddingModel/SetEmbeddingModel.ts"
import type { SetLanguageModel } from "../SetLanguageModel/SetLanguageModel.ts"

export type Action =
  | Context
  | SetEmbeddingModel
  | SetLanguageModel
  | Emit
  | Fork
  | Infer
  | Embed
  | EnableTool
  | DisableTool
  | Message
