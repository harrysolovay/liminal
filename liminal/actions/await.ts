import { Action } from "../Action.ts"

export interface await_<_T> extends Action<"await", never> {}

function* await_<T>(value: T): Generator<await_<Awaited<T>>, Awaited<T>> {
  return yield Action("await", async (scope) => ({
    ...scope,
    nextArg: await value,
  }))
}
Object.defineProperty(await_, "name", { value: "await" })

export { await_ as await }
