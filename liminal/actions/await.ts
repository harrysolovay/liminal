import { Action } from "../Action.ts"

function* await_<T>(value: T): Generator<
  Action<"await", {
    Event: never
    Child: never
    Entry: never
    Throw: never
  }>,
  Awaited<T>
> {
  return yield Action("await", async (scope) => ({
    ...scope,
    nextArg: await value,
  }))
}
Object.defineProperty(await_, "name", { value: "await" })
export { await_ as await }
