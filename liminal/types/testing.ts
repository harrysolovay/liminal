import * as T from "./index.ts"

const g = T.union(
  T.object({
    a: T.number`Testing`,
    b: T.string,
    c: T.const(T.string, "hello"),
    d: {
      another: T.string,
      nested: T.object({
        e: T.number,
      }),
    },
    x: ["A", "B"],
  })`
  Testing
`,
  T.string,
)

console.log(JSON.stringify(g.toJSON(), null, 2))
