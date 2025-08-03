import { AiLanguageModel, AiTool, AiToolkit } from "@effect/ai"
import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { FetchHttpClient } from "@effect/platform"
import { Array, Console, Effect, Layer, Schema } from "effect"
import { event } from "liminal"
import { client, model } from "./_layers.ts"

class ICanHazDadJoke extends Effect.Service<ICanHazDadJoke>()("ICanHazDadJoke", {
  dependencies: [FetchHttpClient.layer],
  effect: Effect.gen(function*() {
    const httpClient = yield* HttpClient.HttpClient
    const httpClientOk = httpClient.pipe(
      HttpClient.filterStatusOk,
      HttpClient.mapRequest(
        HttpClientRequest.prependUrl("https://icanhazdadjoke.com"),
      ),
    )

    const search = Effect.fn("ICanHazDadJoke.search")(function*(searchTerm: string) {
      return yield* httpClientOk.get("/search", {
        acceptJson: true,
        urlParams: { searchTerm },
      }).pipe(
        Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Struct({
          results: Schema.Array(Schema.Struct({
            id: Schema.String,
            joke: Schema.String,
          })),
        }))),
        Effect.flatMap(({ results }) => Array.head(results)),
        Effect.map(({ joke }) => joke),
        Effect.scoped,
        Effect.orDie,
      )
    })

    return { search }
  }),
}) {}

class DadJokeTools extends AiToolkit.make(
  AiTool.make("GetDadJoke", {
    description: "Get a hilarious dad joke from the ICanHazDadJoke API",
    success: Schema.String,
    failure: Schema.Never,
    parameters: {
      searchTerm: Schema.String.annotations({
        description: "The search term to use to find dad jokes",
      }),
    },
  }),
) {}

const DadJokeToolHandlers = DadJokeTools.toLayer(
  Effect.gen(function*() {
    const { search } = yield* ICanHazDadJoke
    return {
      GetDadJoke: ({ searchTerm }) => search(searchTerm),
    }
  }),
).pipe(
  Layer.provide(ICanHazDadJoke.Default),
)

AiLanguageModel.generateText({
  prompt: "Generate a dad joke about pirates",
  toolkit: DadJokeTools,
}).pipe(
  Effect.tap((v) => Console.log(event())),
  Effect.flatMap((response) => Console.log(response.text)),
  Effect.provide([
    model,
    client,
    DadJokeToolHandlers,
  ]),
  Effect.runPromise,
).then((v) => console.log(v))
