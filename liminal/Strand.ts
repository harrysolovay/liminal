import { Message } from "@effect/ai/AiInput"
import * as AiTool from "@effect/ai/AiTool"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "./LEvent.ts"
import { normalize, type OptionallyTaggable } from "./Taggable.ts"

export class Strand extends Context.Tag("liminal/Strand")<Strand, {
  readonly system?: string | undefined
  messages: Array<Message>
  tools?: Array<AiTool.AiTool<string>> | undefined
  readonly events: PubSub.PubSub<LEvent>
}>() {
  /** Create a layer for a Strand, which represents an conversation isolate. */
  static new: OptionallyTaggable<Layer.Layer<Strand>> = (a0, ...aRest) =>
    Layer.effect(
      Strand,
      PubSub.unbounded<LEvent>().pipe(
        Effect.map((events) =>
          Strand.of({
            system: normalize(a0, aRest),
            messages: [],
            events,
          })
        ),
      ),
    )

  /** Create a layer for a Strand, which represents an conversation isolate. */
  static clone: OptionallyTaggable<Layer.Layer<Strand, never, Strand>> = (a0, ...aRest) =>
    Layer.effect(
      Strand,
      Effect.gen(function*() {
        const { system, messages, tools } = yield* Strand
        return Strand.of({
          system: a0 ? normalize(a0, aRest) : system,
          messages: [...messages],
          tools,
          events: yield* PubSub.unbounded<LEvent>(),
        })
      }),
    )
}
