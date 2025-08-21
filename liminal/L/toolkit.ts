import * as AiToolkit from "@effect/ai/AiToolkit"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import type { NeverTool } from "../util/NeverTool.ts"
import { self } from "./self1.ts"

export const toolkit = self.pipe(
  Effect.flatMap(({ tools }) =>
    Option.match(tools, {
      onSome: (tools) => AiToolkit.make(...tools),
      onNone: () => AiToolkit.make<ReadonlyArray<NeverTool>>(),
    })
  ),
)
