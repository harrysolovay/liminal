import { L } from "liminal"
import { gemma3, gpt4o, gpt4oMini, o1Mini } from "./_common.ts"

await L.run(
  function*() {
    yield* L.focus(gpt4oMini)
    yield* L.user`Write a rap about type-level programming in TypeScript`
    yield* L.assistant
    yield* L.user`Rewrite it in whatever way you think best.`
    const variants = yield* L.all({
      *a() {
        return yield* L.assistant
      },
      *b() {
        yield* L.focus(o1Mini)
        return yield* L.assistant
      },
      *c() {
        yield* L.focus(gemma3)
        return yield* L.assistant
      },
    })
    const key = yield* L.strand(function*() {
      yield* L.focus(gpt4o)
      yield* L.user`
        Out of the following variants, which is your favorite?:

        ${JSON.stringify(variants)}
      `
      return yield* L.assistant(L.enum("a", "b", "c"))
    })
    return variants[key]
  },
  { handler: console.log },
)
