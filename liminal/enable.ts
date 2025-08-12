import type { AiTool, AnyStructSchema, Handler } from "@effect/ai/AiTool"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import type { Schema } from "effect/Schema"
import { type Thread, threadTag } from "./Thread.ts"
import type { NeverTool } from "./util/NeverTool.ts"

export const enable = <
  K extends string,
  E extends Schema.All,
  R,
>(
  tool: AiTool<K, AnyStructSchema, Schema.Any, E, R>,
): Effect.Effect<void, E, Handler<K> | Thread | R> =>
  Effect.map(threadTag, (thread) => {
    const tool_: NeverTool = tool as never
    Option.match(thread.tools, {
      onSome: (value) => value.add(tool_),
      onNone: () => {
        thread.tools = Option.some(new Set([tool_]))
      },
    })
  })
