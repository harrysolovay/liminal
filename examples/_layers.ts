import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import { Config, Layer } from "effect"

export const client = OpenAiClient.layerConfig({
  apiKey: Config.redacted("OPENAI_API_KEY"),
}).pipe(
  Layer.provide(FetchHttpClient.layer),
)

export const model = OpenAiLanguageModel.model("gpt-4o-mini").pipe(
  Layer.provide(client),
)
