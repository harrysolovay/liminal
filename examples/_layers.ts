import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import * as DrizzlePg from "@effect/sql-drizzle/Pg"
import { PgClient } from "@effect/sql-pg"
import { Config, Layer } from "effect"

export const ClientLive = OpenAiClient.layerConfig({
  apiKey: Config.redacted("OPENAI_API_KEY"),
}).pipe(
  Layer.provide(FetchHttpClient.layer),
)

export const ModelLive = OpenAiLanguageModel.model("gpt-4o-mini").pipe(
  Layer.provide(ClientLive),
)
