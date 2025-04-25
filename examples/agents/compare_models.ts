import { type } from "arktype"
import { Agent, L } from "liminal"
import "liminal-arktype/register"
import { gemma3, gpt4o, gpt4oMini, o1Mini } from "./models.ts"

await Agent(
  function*() {
    yield* L.model(gpt4oMini)
    yield* L.user`Write a rap about type-level programming in TypeScript`
    yield* L.assistant
    yield* L.user`Rewrite it in whatever way you think best.`
    const variants = yield* L.branch({
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
    const key = yield* L.branch(function*() {
      yield* L.model(gpt4o)
      yield* L.user`
        Out of the following variants, which is your favorite?:

        ${JSON.stringify(variants)}
      `
      const { value } = yield* L.assistant(type({
        value: "'a' | 'b' | 'c'",
      }))
      return value
    })
    return variants[key]
  },
  { handler: console.log },
)
