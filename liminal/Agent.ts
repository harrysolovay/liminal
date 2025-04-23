import { Context } from "./Context.ts"
import { run } from "./run.ts"
import type { Rune, RuneKey } from "./Rune.ts"
import type { Runic } from "./Runic.ts"
import { Fiber } from "./state/Fiber.ts"
import { Globals } from "./state/Globals.ts"

export interface Agent<out T, out E> extends PromiseLike<T> {
  T: T
  E: E
}

export function Agent<Y extends Rune, T>(
  runic: Runic<Y, T>,
  globals?: Partial<Globals<Y[RuneKey]>>,
): Agent<T, Rune.E<Y>> {
  return {
    then(onfulfilled, onrejected) {
      const context = new Context([
        [Globals.make, Globals.make(globals)],
        [Fiber.make, Fiber.make()],
      ])
      return Context.storage.run(context, () => run(runic).then(onfulfilled, onrejected))
    },
  } satisfies Omit<Agent<T, Rune.E<Y>>, "E" | "T"> as never
}
