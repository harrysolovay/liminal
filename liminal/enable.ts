import type { AiTool, AnyStructSchema, Handler } from "@effect/ai/AiTool"
import * as Effect from "effect/Effect"
import type { Schema } from "effect/Schema"
import { Strand } from "./Strand.ts"

export const enable: <
  K extends string,
  E extends Schema.All,
  R,
>(
  toolkit: AiTool<K, AnyStructSchema, Schema.Any, E, R>,
) => Effect.Effect<void, E, Handler<K> | Strand | R> = (toolkit) =>
  Effect.map(Strand, ({ tools }) => {
    tools.add(toolkit as never)
  })
