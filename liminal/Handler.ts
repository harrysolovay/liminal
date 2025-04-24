import { ContextHandle } from "./Context.ts"
import type { RuntimeEvent } from "./RuntimeEvent.ts"

export type Handler<E = any> = [(event: RuntimeEvent<E>) => void][0]

export const HandlerContext: ContextHandle<Handler | undefined> = ContextHandle()
