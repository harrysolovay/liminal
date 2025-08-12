import * as AiInput from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { append } from "./L/append.ts"
import { Self } from "./L/Self.ts"
import { raw } from "./raw.ts"
import type { Thread } from "./Thread.ts"
import { type Taggable } from "./util/Taggable.ts"

export interface Addresses {
  readonly to: Array<Thread>
  readonly cc?: Array<Thread> | undefined
  readonly bcc?: Array<Thread> | undefined
}

export interface EnvelopeMembers {
  readonly addresses: Addresses
  readonly cc: (...cc: Array<Thread>) => Envelope
  readonly bcc: (...bcc: Array<Thread>) => Envelope
}

export interface Envelope extends Taggable<void, never, Thread>, EnvelopeMembers {}

export const Envelope = (addresses: Addresses): Envelope =>
  Object.assign(
    Effect.fnUntraced(function*(a0, ...aRest) {
      const { state: { fqn } } = yield* Self
      const name = Option.getOrElse(fqn, () => "anonymous-entity")
      const text = yield* raw(a0, aRest)
      if (text) {
        // TODO: cc, bcc
        const { to, cc: _cc, bcc: _bcc } = addresses
        for (const recipient of to) {
          yield* append(AiInput.UserMessage.make({
            parts: [
              AiInput.TextPart.make({
                text: yield* raw`[FROM: ${name} ]\n${text}`,
              }),
            ],
          })).pipe(Effect.provideService(Self, recipient))
        }
      }
    }) satisfies Taggable<void, never, Thread>,
    {
      addresses,
      cc: (...cc) => Envelope({ ...addresses, cc }),
      bcc: (...bcc) => Envelope({ ...addresses, bcc }),
    } satisfies EnvelopeMembers,
  )
