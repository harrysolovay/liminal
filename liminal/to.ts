import { Envelope } from "./Envelope.ts"
import type { Thread } from "./Thread.ts"

export const to = (...to: Array<Thread>): Envelope => Envelope({ to })
