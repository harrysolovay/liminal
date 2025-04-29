import type { StrandStatus } from "./Strand.ts"

export const LiminalErrorTag = Symbol.for("liminal/LiminalError")
export type LiminalErrorTag = typeof LiminalErrorTag

export class StrandRejectedError extends Error {
  readonly brand: LiminalErrorTag = LiminalErrorTag
  override readonly name: string = "StrandRejectedError"
  constructor(readonly status: StrandStatus.Rejected) {
    super()
  }
}
