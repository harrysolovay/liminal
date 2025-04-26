// import { L } from "liminal"
// import { fromArktype } from "liminal-schema/arktype"

// export function* refine(input: string) {
//   yield* L.user(input)
//   yield* L.assistant
//   yield* L.user`Rewrite it in whatever way you think best.`
//   const variants = yield* L.branch({
//     *a() {
//       yield* L.declareModel("a", "language")
//       return yield* L.assistant
//     },
//     *b() {
//       yield* L.declareModel("b", "language")
//       return yield* L.assistant
//     },
//     *c() {
//       yield* L.declareModel("c", "language")
//       return yield* L.assistant
//     },
//   })
//   const { value } = yield* L.branch("select", function*() {
//     yield* L.clear()
//     yield* L.declareModel("select", "language")
//     yield* L.user`
//       Out of the following variants, which is your favorite?:

//       ${JSON.stringify(variants)}
//     `
//     const { value } = yield* fromArktype(type({
//       value: "'a' | 'b' | 'c'",
//     }))
//     return value
//   })
//   return variants[value]
// }
