import * as AiTool from "@effect/ai/AiTool"
import * as Effect from "effect/Effect"
import { Strand } from "./Strand"

export const disable: (tool: AiTool.Any) => Effect.Effect<void, never, Strand> = (tool) =>
  Effect.map(Strand, ({ tools }) => {
    tools.delete(tool as never)
  })
