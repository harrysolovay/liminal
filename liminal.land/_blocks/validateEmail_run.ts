import { Effect } from "effect"

// ---cut---
import { ModelLive } from "./ModelLive.ts"
import { validateEmail } from "./validateEmail.ts"

const errorMessage = await validateEmail("≽^•⩊•^≼").pipe(
  Effect.provide(ModelLive),
  Effect.runPromise,
)
