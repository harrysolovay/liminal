// import { L } from "liminal"

// export default function*() {
//   const result = yield* L.catch("attempt-key", mayThrow)
//   if (result.thrown) {
//     console.log("Threw the following value:", result.thrown)
//   } else {
//     console.log("Succeed with the following value:", result.value)
//   }
// }

// function* mayThrow() {
//   try {
//     return externalExample()
//   } catch (thrown: unknown) {
//     if (thrown instanceof RandomError) {
//       return yield* L.throw(thrown)
//     }
//     throw thrown // unrecoverable
//   }
// }

// class RandomError extends Error {
//   override readonly name = "RandomError"
// }

// function externalExample(): number {
//   const rand = Math.random()
//   if (rand > .5) {
//     throw new RandomError()
//   }
//   return rand
// }
