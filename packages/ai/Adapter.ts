import { Adapter } from "liminal"
import { reduceValue } from "./reduceValue.js"
import { reduceUserText } from "./reduceUserText.js"
import { reduceUserTexts } from "./reduceUserTexts.js"
import type { AIExecSpec } from "./AIExecSpec.js"
import { reduceEmbedding } from "./reduceEmbedding.js"

export const adapter = Adapter<AIExecSpec>({
  reduceValue,
  reduceEmbedding,
  reduceUserText,
  reduceUserTexts,
})
