import type { Fiber, FiberInfo } from "./Fiber.ts"

export interface RuntimeEvent<E> extends FiberInfo {
  readonly parent?: FiberInfo
  readonly event: E
}
