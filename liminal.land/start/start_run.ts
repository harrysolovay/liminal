import { Effect } from "effect"
import { L } from "liminal"
import { model } from "./model.ts"
import { validateEmail } from "./validateEmail.ts"

// ---cut---
const errorMessage = await validateEmail("≽^•⩊•^≼").pipe(
  L.strand,
  Effect.provide(model),
  Effect.runPromise,
)
