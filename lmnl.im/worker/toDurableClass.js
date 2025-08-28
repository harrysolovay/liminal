import * as HttpServerError from "@effect/platform/HttpServerError";
import * as HttpServerRequest from "@effect/platform/HttpServerRequest";
import * as HttpServerResponse from "@effect/platform/HttpServerResponse";
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import * as SqliteClient from "@effect/sql-sqlite-do/SqliteClient";
import * as SqlClient from "@effect/sql/SqlClient";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";
import { toFetch } from "./toFetch.js";
export const toDurableClass = (x) => class {
    async fetch(request, { db }) {
        return toFetch(x).pipe(Effect.provideService(HttpServerRequest.HttpServerRequest, HttpServerRequest.fromWeb(request)), Effect.provide(SqliteDrizzle.layer.pipe(Layer.provideMerge(SqliteClient.layer({ db })))), Effect.scoped, Effect.runPromise);
    }
};
//# sourceMappingURL=toDurableClass.js.map