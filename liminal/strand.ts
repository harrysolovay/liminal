import * as AiInput from "@effect/ai/AiInput"
import * as AiTool from "@effect/ai/AiTool"
import type * as AiToolkit from "@effect/ai/AiToolkit"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as Ref from "effect/Ref"
import { MessagesRef, System, Toolkit } from "./Context.ts"

export interface StrandOptions<in out Tool extends AiTool.Any> {
  /** The system prompt. */
  system?: string | undefined
  /** The initial list of AI input messages. */
  messages?: Iterable<AiInput.Message> | undefined
  /** The tools to use for by strand. */
  toolkit?: AiToolkit.AiToolkit<Tool> | undefined
}

/** Create an isolated clone of the current conversation to provide for an effect. */
export const strand: <HE = never, T extends AiTool.Any = never>(
  options?: StrandOptions<T>,
) => <A, E, R>(
  effect: Effect.Effect<A, E, R>,
) => Effect.Effect<A, E | HE, Exclude<R, MessagesRef | System> | T> = (options) => (effect) =>
  Effect.gen(function*() {
    const messagesRef = options?.messages
      ? Ref.unsafeMake([...options.messages])
      : yield* Option.match(yield* Effect.serviceOption(MessagesRef), {
        *onSome(ref) {
          return Ref.unsafeMake([...yield* Ref.get(ref)])
        },
        onNone: () => Ref.make([] as Array<AiInput.Message>),
      })
    return yield* (effect.pipe(
      Effect.provideService(MessagesRef, messagesRef),
      Effect.provideService(System, options?.system),
      Effect.provideService(Toolkit, options?.toolkit),
    ))
  }) as never
