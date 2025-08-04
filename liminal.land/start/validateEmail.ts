import { Effect } from "effect"
import { L } from "liminal"
declare const EMAIL_REGEX: RegExp

// ---cut---
export const validateEmail = Effect.fn(function*(email: string) {
  if (EMAIL_REGEX.test(email)) return

  // Provide a system prompt.
  yield* L.system`You are an email-validating assistant.`

  // If invalid, ask why.
  yield* L.user`Why is the following email is invalid?: "${email}".`

  // Infer and return the message.
  return yield* L.assistant
})
