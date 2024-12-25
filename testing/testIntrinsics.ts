import type * as I from "../core/intrinsics.ts"
import type { PromiseOr } from "../util/mod.ts"

export function testIntrinsics<A extends Array<unknown>>(
  name: string,
  f: (t: Deno.TestContext, ...args: A) => PromiseOr<void>,
  argSets: { [K in keyof typeof I]+?: Array<A> },
) {
  Deno.test(name, async (t) => {
    for (const [typeName, sets] of Object.entries(argSets)) {
      await t.step(typeName, async (t) => {
        for (const args of sets) {
          await f(t, ...args)
        }
      })
    }
  })
}
