import type { FiberConfig } from "./Fiber.ts"
import { Runic } from "./Runic.ts"
import { context } from "./state/Context.ts"

export async function run<X extends Runic>(
  runic: X,
  config: FiberConfig<Runic.T<X>>,
): Promise<Runic.T<X>> {
  const { promise, resolve, reject } = Promise.withResolvers<Runic.T<X>>()
  if (config.signal) {
    if (config.signal.aborted) {
      reject(config.signal.reason)
      return await promise
    } else {
      config.signal.addEventListener("abort", () => {
        reject(config.signal?.reason)
      })
    }
  }
  queueMicrotask(() =>
    context.fork(async () => {
      const iterator = Runic.unwrap(runic)
      let nextArg: any
      try {
        let current = await iterator.next(config)
        while (!current.done) {
          const rune = current.value
          nextArg = await rune(config)
          current = await iterator.next(nextArg)
        }
        const { value } = current
        resolve(value)
      } catch (reason: unknown) {
        reject(reason)
      }
    })
  )
  return await promise
}
