import type { AiInput, AiToolkit } from "@effect/ai"
import { Context, Effect, Ref } from "effect"
import { LEvent } from "./LEvent.ts"

export class MessagesRef extends Context.Tag("liminal/Messages")<MessagesRef, Ref.Ref<Array<AiInput.Message>>>() {}

export class System extends Context.Tag("liminal/System")<System, string | undefined>() {}

export class Handler
  extends Context.Tag("liminal/Handler")<Handler, ((event: LEvent) => Effect.Effect<any, any, any>) | undefined>()
{}

export class Toolkit extends Context.Tag("liminal/Tools")<Toolkit, AiToolkit.AiToolkit<any> | undefined>() {}
