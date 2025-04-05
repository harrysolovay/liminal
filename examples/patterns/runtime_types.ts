import { type JSONObjectType, type JSONRefType, L, type Type } from "liminal"

L.null

L.boolean

L.integer

L.number

L.string

L.const(L.string, "Hello Liminal.")

L.enum("A", "B", "C")``

L.union(
  L.number`Something here.`,
  L.string,
  {
    a: L.number,
  },
)

L.array(L.string)
L.array({
  a: {
    b: L.string,
  },
})

L.option(L.string)

L.object({
  a: "some const str",
  b: null, // falsy values treated as `null`
  c: L.string,
  d: {
    value: L.number,
  },
})

L.object([L.string, L.number])

type Recursive = {
  value: Recursive
}
type JSONRecursive = JSONObjectType<{
  value: JSONRefType
}>
const recursive: Type<Recursive, JSONRecursive> = L.object({
  value: L.ref(() => recursive),
})

L.taggedUnion({
  A: L.string,
  B: {
    c: L.number,
    d: {
      another: L.boolean,
    },
  },
  C: false,
  D: null,
  E: ["HELLO", {
    another: L.boolean`sup`,
  }],
})
