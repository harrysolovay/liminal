import * as AiInput from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import type { Envelope } from "../Envelope.ts"
import type { Thread } from "../Thread.ts"
import type { Taggable } from "../util/Taggable.ts"
import { append } from "./append.ts"
import { raw } from "./raw.ts"
import { self } from "./self.ts"

export interface send extends Taggable<void, never, Thread> {}

export const send = (envelope: Envelope): send =>
  Effect.fnUntraced(function*(a0, ...aRest) {
    const { state: { name } } = yield* self
    const name_ = Option.getOrElse(name, () => "anonymous-entity")
    const text = yield* raw(a0, ...aRest)
    if (!text) return
    const { to, cc, bcc } = envelope
    const header = `[FROM: ${name_}${cc?.length ? `; ${cc.join(", ")}` : ""}]`
    const knownRecipients = [...to ?? [], ...cc ?? []]
    const op = append(
      AiInput.UserMessage.make({
        parts: [
          AiInput.TextPart.make({
            text: `${header}\n${text}`,
          }),
        ],
      }),
    )
    for (const recipient of knownRecipients) {
      yield* op.pipe(Effect.provideService(self, recipient))
    }
    if (bcc?.length) {
      for (const hiddenRecipient of bcc) {
        yield* op.pipe(Effect.provideService(self, hiddenRecipient))
      }
    }
  })
