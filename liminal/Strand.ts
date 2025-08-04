import type { Message } from "@effect/ai/AiInput"
import type * as AiToolkit from "@effect/ai/AiToolkit"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "./LEvent.ts"

export declare namespace Strand {
  export interface Service {
    /** The parent strand. */
    readonly parent: Option.Option<Service>
    /** The pubsub with which the current strand's events are emitted. */
    readonly events: PubSub.PubSub<LEvent>
    /** The current system prompt to be passed along to the model. */
    system: Option.Option<string>
    /** The list of messages that the model uses to infer the next message. */
    messages: Array<Message>
    /** The tools available to the model. */
    tools: Set<AiToolkit.Any>
  }
}

/** A context tag that denotes the boundary of a conversation isolate. */
export class Strand extends Context.Tag("liminal/Strand")<Strand, Strand.Service>() {
  static layer: (init?: {
    system?: string | undefined
    messages?: Array<Message> | undefined
    tools?: Set<AiToolkit.Any>
  }) => Layer.Layer<Strand> = ({ system, messages, tools } = {}) =>
    Layer.effect(
      Strand,
      Effect.gen(function*() {
        return Strand.of({
          parent: yield* Effect.serviceOption(Strand),
          events: yield* PubSub.unbounded<LEvent>(),
          system: Option.fromNullable(system),
          messages: [...messages ?? []],
          tools: new Set(tools ?? []),
        })
      }),
    )
}
