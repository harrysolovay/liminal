import { HttpApiError, HttpApiMiddleware, HttpApiSecurity } from "@effect/platform"
import { Context } from "effect"
import type { UserId } from "./UserId.ts"

export class CurrentUser extends Context.Tag("CurrentUser")<CurrentUser, UserId>() {}

export class Auth extends HttpApiMiddleware.Tag<Auth>()("Auth", {
  provides: CurrentUser,
  failure: HttpApiError.Unauthorized,
  security: {
    session: HttpApiSecurity.apiKey({
      in: "cookie",
      key: "__session",
    }),
  },
}) {}
