import * as Schema from "effect/Schema"
import { Thread, ThreadId } from "./ThreadInitial.ts"
import { prefix } from "./util/prefix.ts"
import type { Taggable } from "./util/Taggable.ts"

export class Address extends Schema.Class<Address>(prefix("Address"))({
  to: Schema.Array(ThreadId),
  cc: Schema.Array(ThreadId).pipe(Schema.optional),
  bcc: Schema.Array(ThreadId).pipe(Schema.optional),
}) {}

export interface Envelope extends Taggable<void, never, Thread> {
  address: Address
  cc: (...cc: Array<ThreadId>) => Envelope
  bcc: (...bcc: Array<ThreadId>) => Envelope
}
