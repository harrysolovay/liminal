import * as AiInput from "@effect/ai/AiInput"
import * as AiTool from "@effect/ai/AiTool"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "./LEvent.ts"

export class Strand extends Context.Tag("liminal/Strand")<Strand, {
  readonly system?: string | undefined
  messages: Array<AiInput.Message>
  tools?: Array<AiTool.AiTool<string>> | undefined
  readonly events: PubSub.PubSub<LEvent>
}>() {
  /** Create a layer for a Strand, which represents an conversation isolate. */
  static new: {
    (value?: string | undefined): Layer.Layer<Strand>
    (template: TemplateStringsArray, ...substitutions: Array<unknown>): Layer.Layer<Strand>
  } = (template, ...substitutions) =>
    Layer.effect(
      Strand,
      this.make({
        system: {
          template,
          substitutions,
        },
        messages: [],
        tools: [],
      }),
    )

  /** Create a layer for a Strand, which represents an conversation isolate. */
  static clone: {
    (value?: string | undefined): Layer.Layer<Strand, never, Strand>
    (template: TemplateStringsArray, ...substitutions: Array<unknown>): Layer.Layer<Strand, never, Strand>
  } = (template, ...substitutions) =>
    Layer.effect(
      Strand,
      Effect.gen(this, function*() {
        const { system, messages, tools } = yield* Strand
        return yield* this.make({
          system: template
            ? {
              template,
              substitutions,
            }
            : {
              template: system,
              substitutions: [],
            },
          messages: [...messages],
          tools,
        })
      }),
    )

  private static make: (
    config: {
      system: {
        template: TemplateStringsArray | string | undefined
        substitutions: Array<unknown>
      }
      messages: Array<AiInput.Message>
      tools: Array<AiTool.AiTool<string>> | undefined
    },
  ) => Effect.Effect<Strand["Type"]> = ({ system, messages, tools }) =>
    Effect.gen(function*() {
      return Strand.of({
        system: typeof system.template === "string"
          ? system.template
          : system.template
          ? String.raw(system.template, ...system.substitutions)
          : undefined,
        messages,
        tools,
        events: yield* PubSub.unbounded<LEvent>(),
      })
    })
}
