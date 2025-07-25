import * as OpenAiClient from "@effect/ai-openai/OpenAiClient"
import * as OpenAiLanguageModel from "@effect/ai-openai/OpenAiLanguageModel"
import { FetchHttpClient } from "@effect/platform"
import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import { flow } from "effect/Function"

export const common = flow(
  Effect.provide(OpenAiLanguageModel.model("gpt-4o-mini")),
  Effect.provide(
    OpenAiClient.layerConfig({
      apiKey: Config.redacted("OPENAI_API_KEY"),
    }),
  ),
  Effect.provide(FetchHttpClient.layer),
)
