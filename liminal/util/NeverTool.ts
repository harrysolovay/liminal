import * as AiTool from "@effect/ai/AiTool"
import * as Schema from "effect/Schema"

export type NeverTool = AiTool.AiTool<
  string,
  AiTool.AnyStructSchema,
  Schema.Schema.Any,
  Schema.Schema.Any,
  never
>
