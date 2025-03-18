// import { Type, tool, branch } from "liminal"

// // declare const g: L<string, number>

// const x = Type({
//   x: Type.string,
//   y: Type.string,
//   inner: [Type.string],
//   another: {
//     nested: {
//       blah: Type.array(Type.integer),
//     },
//   },
// })

// const Main = tool<{ testing: "this" }>`
//   Description of what it does!
// `(async function* (blah) {
//   blah
//   yield ""
//   const g = yield* branch("something", function* () {
//     // ...
//     yield ""
//     const x = yield* Another()
//     return 2
//   })
//   return await Promise.resolve("HELLO")
// }, Type.string)

// const Another = tool``(function* (a) {
//   // ...
//   yield ""
//   return ""
// }, Type.integer)

// console.log(JSON.stringify(x.toJSONSchema(), null, 2))

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
