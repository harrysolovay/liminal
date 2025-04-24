import { AgentContext } from "./AgentContext.ts"
import type { Rune } from "./Rune.ts"
import { Runic } from "./Runic.ts"

export function run<T>(runic: Runic<Rune, T>, context: AgentContext): Promise<T> {
  const { promise, resolve, reject } = Promise.withResolvers<T>()
  const { signal } = context.controller
  if (signal.aborted) {
    reject(signal.reason)
    return promise
  } else {
    signal.addEventListener("abort", () => {
      reject(signal.reason)
    })
  }
  AgentContext.storage.run(context, async () => {
    const iterator = Runic.unwrap(runic)
    let nextArg: any
    try {
      let current = await iterator.next()
      while (!current.done) {
        const rune = current.value
        nextArg = await rune()
        current = await iterator.next(nextArg)
      }
      const { value } = current
      resolve(value)
    } catch (reason: unknown) {
      reject(reason)
    }
  })
  return promise
}
