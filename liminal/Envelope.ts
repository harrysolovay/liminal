import * as AiInput from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { append } from "./L/append.ts"
import { raw } from "./L/raw.ts"
import { Self } from "./L/Self.ts"
import type { Thread } from "./Thread.ts"
import { type Taggable } from "./util/Taggable.ts"

export interface MessageHeaders {
  readonly to: Array<Thread>
  readonly cc?: Array<Thread> | undefined
  readonly bcc?: Array<Thread> | undefined
}

export interface EnvelopeMembers {
  readonly headers: MessageHeaders
  readonly cc: (...cc: Array<Thread>) => Envelope
  readonly bcc: (...bcc: Array<Thread>) => Envelope
}

export interface Envelope extends Taggable<void, never, Thread>, EnvelopeMembers {}

// TODO: cc, bcc
export const Envelope = (headers: MessageHeaders): Envelope =>
  Object.assign(
    Effect.fnUntraced(function*(a0, ...aRest) {
      const { state: { name: fqn } } = yield* Self
      const name = Option.getOrElse(fqn, () => "anonymous-entity")
      const text = yield* raw(a0, ...aRest)
      if (!text) return
      const { to, cc: _cc, bcc: _bcc } = headers
      for (const recipient of to) {
        yield* append(AiInput.UserMessage.make({
          parts: [
            AiInput.TextPart.make({
              text: `[FROM: ${name}]\n${text}`,
            }),
          ],
        })).pipe(Effect.provideService(Self, recipient))
      }
    }) satisfies Taggable<void, never, Thread>,
    {
      headers,
      cc: (...cc) => Envelope({ ...headers, cc }),
      bcc: (...bcc) => Envelope({ ...headers, bcc }),
    } satisfies EnvelopeMembers,
  )
