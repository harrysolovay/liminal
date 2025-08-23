import * as AiInput from "@effect/ai/AiInput"
import * as Array from "effect/Array"
import * as Effect from "effect/Effect"
import type { Envelope } from "../Envelope.ts"
import type { Thread } from "../Thread.ts"
import type { Taggable } from "../util/Taggable.ts"
import { append } from "./append.ts"
import { raw } from "./raw.ts"
import { self } from "./self.ts"

export interface send extends Taggable<void, never, Thread> {}

export const send = (envelope: Envelope): send =>
  Effect.fnUntraced(function*(a0, ...aRest) {
    const text = yield* raw(a0, ...aRest)
    if (!text) return
    const { to, cc, bcc } = envelope
    const ccHeader = cc?.length
      ? yield* raw`; ${Effect.all(cc).pipe(Effect.map(Array.join(", ")))}`
      : ""
    const headers = raw`[FROM: ${self}${ccHeader}]`
    const knownRecipients = [...to ?? [], ...cc ?? []]
    const program = append(
      AiInput.UserMessage.make({
        parts: [
          AiInput.TextPart.make({
            text: `${headers}\n${text}`,
          }),
        ],
      }),
    )
    for (const recipient of knownRecipients) {
      yield* program.pipe(Effect.provideService(self, recipient))
    }
    if (bcc?.length) {
      for (const hiddenRecipient of bcc) {
        yield* program.pipe(Effect.provideService(self, hiddenRecipient))
      }
    }
  })
