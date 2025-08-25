import * as AiInput from "@effect/ai/AiInput"
import * as Array from "effect/Array"
import * as Effect from "effect/Effect"
import type { YieldWrap } from "effect/Utils"
import type { Envelope } from "../Envelope.ts"
import type { Thread } from "../Thread.ts"
import type { ExtractE, ExtractR } from "../util/extract.ts"
import { raw } from "../util/raw.ts"
import { normalize, type TaggableArg0, type TaggableArgRest } from "../util/Taggable.ts"
import { append } from "./append.ts"
import { self } from "./self.ts"

export const send = (envelope: Envelope) =>
  Effect.fnUntraced(function*<
    A0 extends TaggableArg0,
    ARest extends TaggableArgRest<A0>,
  >(
    a0: A0,
    ...aRest: ARest
  ): Generator<
    YieldWrap<
      Effect.Effect<
        void,
        ExtractE<A0 | ARest[number]>,
        ExtractR<A0 | ARest[number]> | Thread
      >
    >,
    void,
    never
  > {
    const text = yield* normalize(a0, ...aRest)
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
