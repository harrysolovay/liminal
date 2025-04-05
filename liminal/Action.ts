import type { AppendMessage } from "./actions/AppendMessage.ts"
import type { Arg } from "./actions/Arg.ts"
import type { Await } from "./actions/Await.ts"
import type { DisableTool } from "./actions/DisableTool.ts"
import type { Embed } from "./actions/Embed.ts"
import type { Emit } from "./actions/Emit.ts"
import type { EnableTool } from "./actions/EnableTool.ts"
import type { Fork } from "./actions/Fork.ts"
import type { GetMessages } from "./actions/GetMessages.ts"
import type { Infer } from "./actions/Infer.ts"
import type { SetEmbeddingModel } from "./actions/SetEmbeddingModel.ts"
import type { SetLanguageModel } from "./actions/SetLanguageModel.ts"
import type { SetMessages } from "./actions/SetMessages.ts"
import type { Try } from "./actions/Try.ts"

export type Action =
  | Try
  | Await
  | Arg
  | SetEmbeddingModel
  | SetLanguageModel
  | Emit
  | Fork
  | Infer
  | Embed
  | EnableTool
  | DisableTool
  | AppendMessage
  | SetMessages
  | GetMessages
