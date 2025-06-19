import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import { Config, Effect, flow } from "effect"

export const common = flow(
  Effect.onError((cause) => Effect.logError(cause.toString())),
  Effect.provide(OpenAiLanguageModel.model("gpt-4o-mini")),
  Effect.provide(
    OpenAiClient.layerConfig({
      apiKey: Config.redacted("OPENAI_API_KEY"),
    }),
  ),
  Effect.provide(FetchHttpClient.layer),
)
