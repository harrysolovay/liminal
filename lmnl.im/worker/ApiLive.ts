import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@lmnl.im/domain"
import { Effect } from "effect"

export const ApiLive = HttpApiBuilder.group(
  Api,
  "v1",
  Effect.fn(function*(handlers) {
    return handlers.handle(
      "sendMessage",
      Effect.fn(function*({ payload: { message } }) {
        console.log({ loggingHere: message })
        // const user = yield* CurrentUser
        return message
      }),
    )
  }),
)
