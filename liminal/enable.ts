import type { AiTool, AnyStructSchema, Handler } from "@effect/ai/AiTool"
import * as Effect from "effect/Effect"
import type { Schema } from "effect/Schema"
import { Thread } from "./ThreadInitial.ts"

export const enable: <
  K extends string,
  E extends Schema.All,
  R,
>(
  toolkit: AiTool<K, AnyStructSchema, Schema.Any, E, R>,
) => Effect.Effect<void, E, Handler<K> | Thread | R> = (toolkit) =>
  Effect.map(Thread, ({ tools }) => {
    tools.add(toolkit as never)
  })
