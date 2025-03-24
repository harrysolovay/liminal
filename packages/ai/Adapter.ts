import type { CoreMessage, LanguageModelV1 } from "ai"
import { Adapter } from "liminal"
import { reduceAssistant } from "./reduceAssistant.js"
import { reduceUserText } from "./reduceUserText.js"
import { reduceUserTexts } from "./reduceUserTexts.js"

export const adapter = Adapter<LanguageModelV1, CoreMessage>({
  reduceAssistant,
  reduceUserText,
  reduceUserTexts,
})
