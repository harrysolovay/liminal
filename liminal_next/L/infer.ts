import type { LSchema } from "liminal-schema"
import { RuneBase } from "../runes/_RuneBase.ts"
import type { Infer } from "../runes/Infer.ts"

export function* _infer(schema?: LSchema): Generator<Infer, string> {
  return yield RuneBase("infer", schema ? { schema } : {})
}
