import * as HttpServerError from "@effect/platform/HttpServerError"
import * as HttpServerRequest from "@effect/platform/HttpServerRequest"
import * as HttpServerResponse from "@effect/platform/HttpServerResponse"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Scope from "effect/Scope"

export const makeFetch = <A, E>(
  x: Effect.Effect<A, E, HttpServerRequest.HttpServerRequest | Scope.Scope>,
) =>
(request: Request): Promise<Response> =>
  Effect.exit(x).pipe(
    Effect.flatMap(Exit.match({
      onSuccess: Effect.fn(function*(v) {
        return yield* HttpServerResponse.json(v)
      }),
      onFailure: Effect.fn(function*(v) {
        const [response] = yield* HttpServerError.causeResponse(v)
        return response
      }),
    })),
    Effect.map(HttpServerResponse.toWeb),
  ).pipe(
    Effect.provideService(
      HttpServerRequest.HttpServerRequest,
      HttpServerRequest.fromWeb(request),
    ),
    Effect.scoped,
    Effect.runPromise,
  )
