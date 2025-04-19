import type { AppendMessage } from "./AppendMessage.ts"
import type { Emit } from "./Emit.ts"
import type { Infer } from "./Infer.ts"
import type { Join } from "./Join.ts"
import type { Launch } from "./Launch.ts"
import type { PushModel } from "./PushModel.ts"
import type { Reflect } from "./Reflect.ts"

export type Rune =
  | AppendMessage
  | Emit
  | Infer
  | Join
  | PushModel
  | Reflect
  | Launch
