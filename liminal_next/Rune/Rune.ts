import type { AppendMessage } from "./AppendMessage.ts"
import type { Branch } from "./Branch.ts"
import type { Catch } from "./Catch.ts"
import type { Emit } from "./Emit.ts"
import type { PushModel } from "./PushModel.ts"
import type { RemoveModel } from "./RemoveModel.ts"
import type { Reply } from "./Reply.ts"

export type Rune =
  | AppendMessage
  | Branch
  | Catch
  | Emit
  | PushModel
  | RemoveModel
  | Reply
