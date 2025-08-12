import type { Envelope } from "./Envelope.ts"
import type { Thread } from "./ThreadInitial.ts"

export declare const to: (...to: Array<Thread.Service>) => Envelope
