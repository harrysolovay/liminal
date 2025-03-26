import { Adapter } from "liminal"
import { reduceGeneration } from "./reduceGeneration.js"
import { reduceUserText } from "./reduceUserText.js"
import { reduceUserTexts } from "./reduceUserTexts.js"
import type { AIExecSpec } from "./AIExecSpec.js"
import { reduceEmbedding } from "./reduceEmbedding.js"

export const adapter = Adapter<AIExecSpec>({
  reduceGeneration,
  reduceEmbedding,
  reduceUserText,
  reduceUserTexts,
})
