import { AiError } from "@effect/ai/AiError"
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import type { Taggable } from "./_Taggable.ts"
import { assistant } from "./assistant.ts"
import { Strand } from "./Strand.ts"
import { user } from "./user.ts"

/** Append a user message to the conversation, then infer and append an assistant message to the conversation. */
export const turn: Taggable<Effect.Effect<string, AiError, Strand | AiLanguageModel>> = flow(
  user,
  Effect.andThen(assistant),
)
