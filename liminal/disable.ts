import * as AiTool from "@effect/ai/AiTool"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { Self } from "./Self.ts"
import type { Thread } from "./Thread.ts"
import type { NeverTool } from "./util/NeverTool.ts"

export const disable = (tool: AiTool.Any): Effect.Effect<void, never, Thread> =>
  Effect.map(Self, ({ tools }) => {
    if (Option.isSome(tools)) {
      tools.value.delete(tool as NeverTool)
    }
  })
