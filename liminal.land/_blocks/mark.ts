import { Effect } from "effect"
import { L } from "liminal"

// ---cut---
const validateEmail = (email: string) =>
  Effect.gen(function*() {
    // Same as above...
    return yield* L.assistant
  }).pipe(
    L.strand,
  )
