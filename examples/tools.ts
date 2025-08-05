import { AiLanguageModel, AiTool, AiToolkit } from "@effect/ai"
import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { FetchHttpClient } from "@effect/platform"
import { Console, Effect, Layer, Schema } from "effect"
import { NoSuchElementException } from "effect/Cause"
// import { L } from "liminal"
import { ClientLive, ModelLive } from "./_layers.ts"

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

class ICanHazDadJoke extends Effect.Service<ICanHazDadJoke>()("ICanHazDadJoke", {
  dependencies: [FetchHttpClient.layer],
  effect: Effect.gen(function*() {
    const client = yield* HttpClient.HttpClient.pipe(
      Effect.map((v) =>
        v.pipe(
          HttpClient.filterStatusOk,
          HttpClient.mapRequest(
            HttpClientRequest.prependUrl("https://icanhazdadjoke.com"),
          ),
        )
      ),
    )
    const search = Effect.fn(function*(searchTerm: string) {
      const { results: [{ joke } = {}] } = yield* client.get("/search", {
        acceptJson: true,
        urlParams: { searchTerm },
      }).pipe(
        Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Struct({
          results: Schema.Array(Schema.Struct({
            id: Schema.String,
            joke: Schema.String,
          })),
        }))),
        Effect.orDie,
      )
      return joke ?? (yield* Effect.die(new NoSuchElementException()))
    })
    return { search }
  }),
}) {}

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

// await L.strand(
//   L.enable(DadJokeTools),
//   L.user`Generate a dad joke about pirates.`,
//   L.assistant,
// ).pipe(
//   Effect.provide(ModelLive),
//   Effect.runFork,
// )

AiLanguageModel.generateText({
  prompt: "Generate a dad joke about pirates.",
  toolkit: DadJokeTools,
}).pipe(
  Effect.map((response) => [...response.results.values()].pop()!),
  Effect.tap(Console.log),
  Effect.provide([
    ModelLive,
    ClientLive,
    DadJokeToolHandlers,
  ]),
  Effect.runFork,
)
