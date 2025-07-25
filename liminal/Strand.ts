import * as AiInput from "@effect/ai/AiInput"
import * as AiTool from "@effect/ai/AiTool"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"

export interface StrandConfig<E, R> {
  /** The system prompt. */
  system?: string | undefined
  /** The initial list of AI input messages. */
  messages?: Array<AiInput.Message> | undefined
  /** Handler to be execute when messages are appended. */
  onMessage?: (message: AiInput.Message) => Effect.Effect<void, E, R>
}

export class Strand extends Context.Tag("liminal/Strand")<Strand, {
  system?: string | undefined
  messages: Array<AiInput.Message>
  tools?: Array<AiTool.AiTool<any>>
  onMessage: (message: AiInput.Message) => Effect.Effect<void>
}>() {}

/** Create an isolated clone of the current conversation to provide for an effect. */
export const make: <E = never, R = never>(
  config?: StrandConfig<E, R>,
) => Effect.Effect<Strand["Type"], E, R> = (config) =>
  Effect.map(
    Effect.serviceOption(Strand),
    Option.match({
      onSome: ({ system, messages, tools, onMessage }) => ({
        system: config ? config?.system : system,
        messages: [...config ? config?.messages ?? [] : messages],
        tools: [...tools ?? []],
        onMessage: onMessage ?? (() => Effect.succeed(undefined)),
      }),
      onNone: () => ({
        system: config?.system,
        messages: config?.messages ?? [],
        onMessage: (config?.onMessage ?? (() => Effect.succeed(undefined))) as never,
      }),
    }),
  )

export const layer: <E = never, R = never>(config?: StrandConfig<E, R>) => Layer.Layer<Strand, E, R> = (config) =>
  Layer.effect(Strand, make(config))
