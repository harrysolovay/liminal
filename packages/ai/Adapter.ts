import type { CoreMessage, LanguageModelV1 } from "ai"
import { Adapter } from "liminal"
import { reduceT } from "./reduceT.js"
import { reduceUserText } from "./reduceUserText.js"
import { reduceUserTexts } from "./reduceUserTexts.js"

export const adapter = Adapter<LanguageModelV1, CoreMessage>({
  reduceT,
  reduceUserText,
  reduceUserTexts,
})
