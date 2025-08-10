import * as AiTool from "@effect/ai/AiTool"
import type { AiToolkit } from "@effect/ai/AiToolkit"
import * as Effect from "effect/Effect"
import { Strand } from "./Strand"

export const disable: (toolkit: AiToolkit<AiTool.Any>) => Effect.Effect<void, never, Strand> = (toolkit) =>
  Effect.map(Strand, ({ tools }) => {
    tools.delete(toolkit)
  })
