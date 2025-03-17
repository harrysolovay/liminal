import { L, agent, branch } from "liminal"

// declare const g: L<string, number>

const x = L({
  x: L.string,
  y: L.string,
  inner: [L.string],
  another: {
    nested: {
      blah: L.array(L.integer),
    },
  },
})

const Main = agent<{ testing: "this" }>`
  Description of what it does!
`(async function* (blah) {
  blah
  yield ""
  const g = yield* branch("something", function* () {
    // ...
    yield ""
    const x = yield* Another()
    return 2
  })
  return await Promise.resolve("HELLO")
}, L.string)

const Another = agent``(function* (a) {
  // ...
  yield ""
  return ""
}, L.integer)

console.log(JSON.stringify(x.toJSONSchema(), null, 2))

// import { L, agent, E, branch, stream, Exec, child } from "liminal"

// declare const oai: any

// export const Main = agent<E>`
//   Description of what it does.
// `(
//   async function* ({ a, b }) {
//     yield ""

//     // this.db

//     const v = yield* L.string

//     for await (const x of yield* stream(L.string)) {
//       x
//     }

//     const detach = yield* AnotherActor(this)

//     const result = yield* branch("id", Another())

//     const result2 = yield* child("id", Gen())

//     yield E("id", {})
//   },
//   {
//     a: L.string,
//     b: L.string,
//   },
// )

// const AnotherActor = agent`
//   ...
// `(function* () {})

// function* Another() {
//   yield ""
//   return yield* L.string
// }

// function* Gen() {}

// for await (const e of Exec(oai).iter()) {
//   e
// }
