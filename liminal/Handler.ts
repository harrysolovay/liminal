import { ContextHandle } from "./Context.ts"
import type { Fiber } from "./Fiber.ts"

export type Handler<E = any> = [(this: Fiber, event: E) => void][0]

export const HandlerContext: ContextHandle<Handler | undefined> = ContextHandle()
