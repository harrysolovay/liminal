import { HttpServerRequest } from "@effect/platform"
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite"
import * as SqliteClient from "@effect/sql-sqlite-do/SqliteClient"
import { session } from "@liminal/sqlite"
import { makeFetch } from "@liminal/workerd"
import { Console, Effect, Layer } from "effect"
import { L } from "liminal"
import { ModelLive } from "./layers.ts"

export default {
  fetch: Effect.gen(function*() {
    const res = yield* HttpServerRequest.HttpServerRequest

    yield* Console.log(res)
  }).pipe(
    L.make(
      session({
        threadId: "router",
      }),
    ),
    Effect.provide([
      ModelLive,
      SqliteDrizzle.layer.pipe(
        Layer.provideMerge(
          SqliteClient.layer({ db: null! }),
        ),
      ),
    ]),
    makeFetch,
  ),
}
