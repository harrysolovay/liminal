import { HttpApiBuilder, HttpApiSwagger, HttpServer } from "@effect/platform"
import { BunHttpServer } from "@effect/platform-bun"
import { Api } from "@lmnl.im/domain"
import { Effect, Layer } from "effect"
import { ApiLive } from "./ApiLive.ts"
import { AuthLive } from "./AuthLive.ts"
import { config } from "./config.ts"

const CorsLive = Layer.unwrapEffect(
  config.pipe(
    Effect.map(({ appUrl }) =>
      HttpApiBuilder.middlewareCors({
        allowedOrigins: [appUrl],
        allowedMethods: ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization", "B3", "traceparent"],
        credentials: true,
      })
    ),
  ),
)

HttpApiBuilder.serve().pipe(
  HttpServer.withLogAddress,
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(
    HttpApiBuilder.api(Api).pipe(
      Layer.provide(
        ApiLive.pipe(
          Layer.provide([AuthLive, CorsLive]),
        ),
      ),
    ),
  ),
  Layer.provide(
    BunHttpServer.layer({
      port: 3000,
    }),
  ),
  Layer.launch,
  Effect.runFork,
)
