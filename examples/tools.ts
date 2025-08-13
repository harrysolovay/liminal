import { AiTool, AiToolkit } from "@effect/ai"
import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { Effect, flow, Option, Schema } from "effect"
import L from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

const DadJokeTool = AiTool.make("GetDadJoke", {
  description: "Get a hilarious dad joke from the ICanHazDadJoke API",
  success: Schema.String,
  failure: Schema.Never,
  parameters: {
    searchTerm: Schema.String.annotations({
      description: "The search term to use to find dad jokes",
    }),
  },
})

class ICanHazDadJoke extends Effect.Service<ICanHazDadJoke>()("ICanHazDadJoke", {
  accessors: true,
  dependencies: [FetchHttpClient.layer],
  effect: Effect.gen(function*() {
    const client = yield* HttpClient.HttpClient.pipe(
      Effect.map(flow(
        HttpClient.filterStatusOk,
        HttpClient.mapRequest(
          HttpClientRequest.prependUrl("https://icanhazdadjoke.com"),
        ),
      )),
    )
    const search: (searchTerm: string) => Effect.Effect<string> = Effect.fn(
      function*(searchTerm) {
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
        )
        return yield* Option.fromNullable(joke)
      },
      (e) => e.pipe(Effect.orDie),
    )
    return { search }
  }),
}) {}

const DadJokeToolHandlers = AiToolkit.make(DadJokeTool).toLayer({
  GetDadJoke: ({ searchTerm }) =>
    ICanHazDadJoke.search(searchTerm).pipe(
      Effect.provide(ICanHazDadJoke.Default),
    ),
})

Effect.gen(function*() {
  yield* logger
  yield* L.enable(DadJokeTool)
  yield* L.user`Generate a dad joke about pirates.`
  yield* L.assistant
}).pipe(
  L.thread,
  Effect.scoped,
  Effect.provide([ModelLive, DadJokeToolHandlers]),
  Effect.runFork,
)
