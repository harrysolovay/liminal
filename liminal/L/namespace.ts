// import type { Rune } from "../Rune"
// import type { Runic } from "../Runic"

// export function* namespace<K extends keyof any, X extends Runic>(
//   key: K,
//   runic: X,
// ): Generator<Rune<never> | Runic.Y<X>, Runic.T<X>> {
//   const { globals, state } = self_
//   const namespace = globals.namespace(key)
//   return yield* rune((fiber) => Fiber(fiber.globals, fiber.parent, runic, state.clone()))
// }
