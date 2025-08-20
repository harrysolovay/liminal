import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite"
import { SqliteClient } from "@effect/sql-sqlite-bun"
import { Config, Layer } from "effect"

export const ClientLive = OpenAiClient.layerConfig({
  apiKey: Config.redacted("OPENAI_API_KEY"),
}).pipe(
  Layer.provide(FetchHttpClient.layer),
)

export const ModelLive = OpenAiLanguageModel.model("gpt-4o-mini").pipe(
  Layer.provide(ClientLive),
)

export const DbLive = SqliteDrizzle.layer.pipe(
  Layer.provide(SqliteClient.layer({
    filename: "examples/examples.db",
  })),
)
