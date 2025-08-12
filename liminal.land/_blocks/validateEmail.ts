import { Effect } from "effect"
import { L } from "liminal"
declare const EMAIL_REGEX: RegExp

// ---cut---
export const validateEmail = (email: string) =>
  Effect.gen(function*() {
    // If valid, return undefined.
    if (EMAIL_REGEX.test(email)) return

    // Otherwise, set the system prompt.
    yield* L.system`You are an email-validating assistant.`

    // If invalid, ask why.
    yield* L.user`Why is the following email is invalid?: "${email}".`

    // Infer and return the message.
    return yield* L.assistant
  }).pipe(
    L.root,
  )
