import type { SqlStorage } from "@cloudflare/workers-types"
import * as HttpServerError from "@effect/platform/HttpServerError"
import * as HttpServerRequest from "@effect/platform/HttpServerRequest"
import * as HttpServerResponse from "@effect/platform/HttpServerResponse"
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite"
import * as SqliteClient from "@effect/sql-sqlite-do/SqliteClient"
import * as SqlClient from "@effect/sql/SqlClient"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"
import * as Scope from "effect/Scope"

type Env = {
  readonly db: SqlStorage
}

export const DurableClass = <A, E>(
  x: Effect.Effect<
    A,
    E,
    SqlClient.SqlClient | HttpServerRequest.HttpServerRequest | Scope.Scope
  >,
) =>
  class {
    async fetch(request: Request, { db }: Env): Promise<Response> {
      return Effect.exit(x).pipe(
        Effect.flatMap(Exit.match({
          onSuccess: HttpServerResponse.json,
          onFailure: (cause) =>
            HttpServerError.causeResponse(cause).pipe(
              Effect.map(([e0]) => e0),
            ),
        })),
        Effect.map(HttpServerResponse.toWeb),
      ).pipe(
        Effect.provideService(
          HttpServerRequest.HttpServerRequest,
          HttpServerRequest.fromWeb(request),
        ),
        Effect.provide(
          SqliteDrizzle.layer.pipe(
            Layer.provideMerge(
              SqliteClient.layer({ db }),
            ),
          ),
        ),
        Effect.scoped,
        Effect.runPromise,
      )
    }
  }
