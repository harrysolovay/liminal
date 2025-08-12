import * as AiTool from "@effect/ai/AiTool"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { type Thread, threadTag } from "./Thread.ts"
import type { NeverTool } from "./util/NeverTool.ts"

export const disable = (tool: AiTool.Any): Effect.Effect<void, never, Thread> =>
  Effect.map(threadTag, ({ tools }) => {
    if (Option.isSome(tools)) {
      tools.value.delete(tool as NeverTool)
    }
  })
