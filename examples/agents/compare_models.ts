// import { L } from "liminal"

// export default function*() {
//   yield* L.user`Write a rap about type-level programming in TypeScript`
//   yield* L.assistant
//   yield* L.user`Rewrite it in whatever way you think best.`
//   const variants = yield* L.branch({
//     *a() {
//       // yield* L.declareModel("one", "language")
//       return yield* L.assistant
//     },
//     *b() {
//       // yield* L.declareModel("two", "language")
//       return yield* L.assistant
//     },
//     *c() {
//       // yield* L.declareModel("three", "language")
//       return yield* L.assistant
//     },
//   })
//   const { value } = yield* L.fork(function*() {
//     yield* L.declareModel("arbiter", "language")
//     yield* L.user`
//       Out of the following variants, which is your favorite?:

//       ${JSON.stringify(variants)}
//     `
//     return yield* L.wrapper(L.enum("a", "b", "c"))
//   })
//   return variants[value]
// }
