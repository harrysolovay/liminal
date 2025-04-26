import { ContextPart as ContextPart } from "./Context.ts"
import type { Fiber } from "./Fiber.ts"

export type Handler<E = any> = [(this: Fiber, event: E) => void][0]

export const HandlerContext: ContextPart<Handler | undefined> = ContextPart((parent) => parent, "handler")
