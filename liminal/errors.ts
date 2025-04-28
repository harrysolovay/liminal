import type { FiberStatus } from "./Fiber.ts"

export const LiminalErrorTag = Symbol.for("liminal/LiminalError")
export type LiminalErrorTag = typeof LiminalErrorTag

export class FiberRejectedError extends Error {
  readonly brand: LiminalErrorTag = LiminalErrorTag
  override readonly name: string = "FiberRejectedError"
  constructor(readonly status: FiberStatus.Rejected) {
    super()
  }
}
