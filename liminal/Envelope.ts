import type { Thread } from "./Thread.ts"
import type { Taggable } from "./util/Taggable.ts"

export interface Address {
  to: Array<Thread> | undefined
  cc?: Array<Thread> | undefined
  bcc?: Array<Thread> | undefined
}

export interface Envelope extends Taggable<void, never, Thread> {
  address: Address
  cc: (...cc: Array<Thread>) => Envelope
  bcc: (...bcc: Array<Thread>) => Envelope
}
