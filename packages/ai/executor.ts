import type { LanguageModelV1 } from "ai"
import type { Exec } from "liminal"

export declare function VercelAIExec<Y, T>(
  ai: typeof import("ai"),
  model: LanguageModelV1,
  root: Generator<Y, T>,
): Exec<Y, T>
