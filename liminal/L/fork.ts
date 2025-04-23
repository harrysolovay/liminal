// import type { FiberConfig } from "../Fiber.ts"
// import type { Rune } from "../Rune.ts"
// import type { Runic } from "../Runic.ts"
// import { runic as runic_ } from "./runic.ts"
// import { self } from "./self.ts"

// export interface fork<Y extends Rune, T> extends Generator<Rune<any> | Y, FiberConfig<T>> {}

// export function* fork<Y extends Rune, T>(runic: Runic<Y, T>): fork<Y, T> {
//   const parent = yield* self
//   const { globals, state, signal } = parent
//   const controller = new AbortController()
//   const fiberConfig: FiberConfig = {
//     T: null!,
//     globals,
//     signal: controller.signal,
//     state: state?.clone(),
//   }
//   return (yield* runic_(runic, fiberConfig)) as never
// }
