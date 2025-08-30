import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import { SqliteClient } from "@effect/sql-sqlite-bun"
import { Config, Layer } from "effect"

export const OpenaiClientLive = OpenAiClient.layerConfig({
  apiKey: Config.redacted("OPENAI_API_KEY"),
}).pipe(
  Layer.provide(FetchHttpClient.layer),
)

export const ModelLive = OpenAiLanguageModel.model("gpt-4o-mini").pipe(
  Layer.provide(OpenaiClientLive),
)

export const SqlClientLive = SqliteClient.layer({
  filename: "examples/examples.db",
  disableWAL: true,
})
