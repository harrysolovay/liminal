import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import { Config, Layer } from "effect"

export const ModelLive = OpenAiLanguageModel.model("gpt-4o-mini").pipe(
  Layer.provide(
    OpenAiClient.layerConfig({
      apiKey: Config.redacted("OPENAI_API_KEY"),
    }).pipe(
      Layer.provide(FetchHttpClient.layer),
    ),
  ),
)
