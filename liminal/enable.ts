import * as AiTool from "@effect/ai/AiTool"
import type { AiToolkit } from "@effect/ai/AiToolkit"
import * as Effect from "effect/Effect"
import type { Strand } from "./Strand.ts"

export declare const enable: <Tools extends AiTool.Any>(toolkit: AiToolkit<Tools>) => Effect.Effect<void, never, Strand>
