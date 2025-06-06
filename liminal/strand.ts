import type { AiInput, AiTool, AiToolkit } from "@effect/ai"
import { Effect, Option, Ref } from "effect"
import { Handler, MessagesRef, System, Toolkit } from "./Context.ts"
import { LEvent } from "./LEvent.ts"

export interface StrandOptions<E, R, in out T extends AiTool.Any> {
  /** The system prompt. */
  system?: string | undefined
  /** The initial list of AI input messages. */
  messages?: Iterable<AiInput.Message> | undefined
  /** The liminal event handler. */
  handler?: ((event: LEvent) => Effect.Effect<any, E, R>) | undefined
  /** The tools to use for by strand. */
  tools?: AiToolkit.AiToolkit<T> | undefined
}

/** Create an isolated clone of the current conversation to provide for an effect. */
export const strand: <HE = never, HR = never, T extends AiTool.Any = never>(
  options?: StrandOptions<HE, HR, T>,
) => <A, E, R>(
  effect: Effect.Effect<A, E, R>,
) => Effect.Effect<A, E | HE, Exclude<R, MessagesRef | System | Handler> | T> = (options) => (effect) =>
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
      Effect.provideService(Handler, options?.handler),
      Effect.provideService(Toolkit, options?.tools),
    ))
  }) as never // TODO
