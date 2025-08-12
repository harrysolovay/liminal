import { AiTool, AiToolkit } from "@effect/ai"
import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { Console, Effect, flow, Option, Schema } from "effect"
import L from "liminal"
import { ModelLive } from "./_layers.ts"

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

const DadJokeToolHandlers = AiToolkit.make(DadJokeTool).toLayer(
  AiToolkit.make(DadJokeTool).of({
    GetDadJoke: ({ searchTerm }) =>
      ICanHazDadJoke.search(searchTerm).pipe(
        Effect.provide(ICanHazDadJoke.Default),
      ),
  }),
)

await L.root(
  L.enable(DadJokeTool),
  L.user`Generate a dad joke about pirates.`,
  L.assistant,
).pipe(
  Effect.flatMap(Console.log),
  Effect.provide([ModelLive, DadJokeToolHandlers]),
  Effect.runPromise,
)
