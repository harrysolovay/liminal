import { type } from "arktype"
import { L } from "liminal"
import { compile } from "liminal-arktype"
import { gemma3, gpt4o, gpt4oMini, o1Mini } from "./_models.ts"

await L.run(
  function*() {
    yield* L.model(gpt4oMini)
    yield* L.user`Write a rap about type-level programming in TypeScript`
    yield* L.assistant
    yield* L.user`Rewrite it in whatever way you think best.`
    const variants = yield* L.all({
      *a() {
        return yield* L.assistant
      },
      *b() {
        yield* L.model(o1Mini)
        return yield* L.assistant
      },
      *c() {
        yield* L.model(gemma3)
        return yield* L.assistant
      },
    })
    const key = yield* L.strand(function*() {
      yield* L.model(gpt4o)
      yield* L.user`
        Out of the following variants, which is your favorite?:

        ${JSON.stringify(variants)}
      `
      return yield* L.assistant(compile(type("'a' | 'b' | 'c'")))
    })
    return variants[key]
  },
  { handler: console.log },
)
