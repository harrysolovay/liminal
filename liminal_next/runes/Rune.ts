import type { AppendMessage } from "./AppendMessage.ts"
import type { Branch } from "./Branch.ts"
import type { Emit } from "./Emit.ts"
import type { Infer } from "./Infer.ts"
import type { PushModel } from "./PushModel.ts"

export type Rune =
  | AppendMessage
  | Branch
  | Emit
  | Infer
  | PushModel
