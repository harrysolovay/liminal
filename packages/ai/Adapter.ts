import { Adapter } from "liminal"
import { reduceT } from "./reduceT.js"
import { reduceUserText } from "./reduceUserText.js"
import { reduceUserTexts } from "./reduceUserTexts.js"
import type { AIExecSpec } from "./AIExecSpec.js"
import { reduceV } from "./reduceV.js"

export const adapter = Adapter<AIExecSpec>({
  reduceT,
  reduceV,
  reduceUserText,
  reduceUserTexts,
})
