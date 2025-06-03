import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import { Config, Effect, Layer, pipe } from "effect"

export const openai = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  pipe(
    effect,
    Effect.provide(OpenAiLanguageModel.model("gpt-4o-mini")),
    Effect.provide(
      OpenAiClient
        .layerConfig({
          apiKey: Config.redacted("OPENAI_API_KEY"),
        })
        .pipe(Layer.provide(FetchHttpClient.layer)),
    ),
  )

export const provideCommon = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  pipe(
    effect,
    Effect.onError((cause) => Effect.logError(cause.toString())),
    openai,
  )
