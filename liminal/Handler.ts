import type { Rune } from "./Rune.ts"
import type { Strand } from "./Strand.ts"

export type Handler<Y extends Rune<any> = Rune<any>> = (this: Strand, event: Rune.E<Y>) => void
