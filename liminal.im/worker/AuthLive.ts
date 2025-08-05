import { verifyToken } from "@clerk/backend"
import * as HttpApiError from "@effect/platform/HttpApiError"
import { Auth, UserId } from "@liminal.im/domain"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Redacted from "effect/Redacted"
import { config } from "./config.ts"

export const AuthLive = Layer.effect(
  Auth,
  Effect.gen(function*() {
    const { clerkSecret, appUrl } = yield* config
    return {
      session: Effect.fn(function*(session) {
        const { sub } = yield* Effect.tryPromise({
          try: () =>
            verifyToken(Redacted.value(session), {
              authorizedParties: [appUrl],
              secretKey: Redacted.value(clerkSecret),
            }),
          catch: () => new HttpApiError.Unauthorized(),
        })
        return UserId(sub)
      }),
    }
  }),
)
