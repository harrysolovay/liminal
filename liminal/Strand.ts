import { Message } from "@effect/ai/AiInput"
import type { AiTool } from "@effect/ai/AiTool"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as PubSub from "effect/PubSub"
import { normalize, type TaggableNullable } from "./_Taggable.ts"
import type { LEvent } from "./LEvent.ts"

export interface StrandInit {
  readonly system?: string | undefined
  readonly messages?: Array<Message> | undefined
  readonly tools?: Array<AiTool<string>> | undefined
  readonly events: PubSub.PubSub<LEvent>
}

export class Strand extends Context.Tag("liminal/Strand")<Strand, {
  readonly system: string | undefined
  messages: Array<Message>
  tools?: Array<AiTool<string>> | undefined
  readonly events: PubSub.PubSub<LEvent>
}>() {
  static make: (init: StrandInit) => Strand["Type"] = ({
    system,
    messages = [],
    tools,
    events,
  }) => Strand.of({ system, messages, tools, events })

  /** Create a layer for a Strand, which represents an conversation isolate. */
  static new: TaggableNullable<Layer.Layer<Strand>> = (a0, ...aRest) =>
    Layer.effect(
      Strand,
      Effect.gen(this, function*() {
        return this.make({
          system: normalize(a0, aRest),
          events: yield* PubSub.unbounded<LEvent>(),
        })
      }),
    )

  /** Create a layer for a Strand, which represents an conversation isolate. */
  static clone: TaggableNullable<Layer.Layer<Strand, never, Strand>> = (a0, ...aRest) =>
    Layer.effect(
      Strand,
      Effect.gen(this, function*() {
        const { system, messages, tools } = yield* Strand
        return this.make({
          system: a0 ? normalize(a0, aRest) : system,
          messages: [...messages],
          tools,
          events: yield* PubSub.unbounded<LEvent>(),
        })
      }),
    )
}
