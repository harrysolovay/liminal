import type { Envelope } from "./Envelope.ts"
import type { Thread } from "./Thread.ts"

export declare const to: (...to: Array<Thread>) => Envelope
