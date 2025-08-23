import { Thread } from "./Thread.ts"

export type Envelope =
  & ({
    to: Array<Thread>
    cc?: never
  } | {
    to?: never
    cc: Array<Thread>
  } | {
    to: Array<Thread>
    cc: Array<Thread>
  })
  & {
    bcc?: Array<Thread>
  }
