import type { AppendMessage } from "./AppendMessage.ts"
import type { AppendTaggedMessage } from "./AppendTaggedMessage.ts"
import type { Branch } from "./Branch.ts"
import type { Catch } from "./Catch.ts"
import type { Emit } from "./Emit.ts"
import type { EnableTool } from "./EnableTool.ts"
import type { GetMessages } from "./GetMessages.ts"
import type { Mark } from "./Mark.ts"
import type { PushModel } from "./PushModel.ts"
import type { Reply } from "./Reply.ts"
import type { Snap } from "./Snap.ts"
import type { Stream } from "./Stream.ts"

export type Rune =
  | AppendMessage
  | AppendTaggedMessage
  | Branch
  | Catch
  | Emit
  | EnableTool
  | GetMessages
  | Mark
  | PushModel
  | Reply
  | Snap
  | Stream
