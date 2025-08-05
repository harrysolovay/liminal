import { Context, Effect } from "effect"

class Random extends Context.Tag("Random")<Random, () => number>() {}

const program = Effect.gen(function*() {
  const random = yield* Random

  return random()
})

program
// ^?
