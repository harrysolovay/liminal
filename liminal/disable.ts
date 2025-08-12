import * as AiTool from "@effect/ai/AiTool"
import * as Effect from "effect/Effect"
import { Thread } from "./ThreadInitial"

export const disable: (tool: AiTool.Any) => Effect.Effect<void, never, Thread> = (tool) =>
  Effect.map(Thread, ({ tools }) => {
    tools.delete(tool as never)
  })
