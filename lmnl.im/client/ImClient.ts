import { FetchHttpClient, HttpApiClient } from "@effect/platform"
import { Api } from "@liminal.im/domain"
import { Effect, Layer, Schema } from "effect"

export class ImClient extends Effect.Service<ImClient>()("Client", {
  accessors: true,
  effect: HttpApiClient.make(Api, {
    baseUrl: Schema.decodeUnknownSync(Schema.String)(
      import.meta.env.VITE_SERVER_URL,
    ),
  }),
  dependencies: [
    FetchHttpClient.layer.pipe(
      Layer.provide(
        Layer.succeed(
          FetchHttpClient.RequestInit,
          FetchHttpClient.RequestInit.of({
            credentials: "include",
          }),
        ),
      ),
    ),
  ],
}) {}
