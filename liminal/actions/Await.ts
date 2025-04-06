import { Action } from "../Action.ts"

function* await_<T>(value: T): Generator<Action<"await", never>, Awaited<T>> {
  return yield Action("await", async (scope) => ({
    ...scope,
    nextArg: await value,
  }))
}
Object.defineProperty(await_, "name", { value: "await" })
export { await_ as await }
