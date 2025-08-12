import * as Context from "effect/Context"
import type { Thread } from "./Thread.ts"
import { prefix } from "./util/prefix.ts"

export const Self: Context.Tag<Thread, Thread> = Context.GenericTag<Thread>(prefix("Self"))
