import * as AiTool from "@effect/ai/AiTool"
import type { AiToolkit } from "@effect/ai/AiToolkit"
import * as Effect from "effect/Effect"
import { Strand } from "./Strand.ts"

export const enable: <Tools extends AiTool.Any>(
  toolkit: AiToolkit<Tools>,
) => Effect.Effect<void, never, AiTool.Handler<Tools["name"]> | Strand> = (toolkit) =>
  Effect.map(Strand, ({ tools }) => {
    tools.add(toolkit)
  })
