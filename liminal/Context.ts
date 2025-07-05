import * as AiInput from "@effect/ai/AiInput"
import * as AiToolkit from "@effect/ai/AiToolkit"
import * as Context from "effect/Context"
import * as Ref from "effect/Ref"

export class MessagesRef extends Context.Tag("liminal/Messages")<MessagesRef, Ref.Ref<Array<AiInput.Message>>>() {}

export class System extends Context.Tag("liminal/System")<System, string | undefined>() {}

export class Toolkit extends Context.Tag("liminal/Tools")<Toolkit, AiToolkit.AiToolkit<any> | undefined>() {}
