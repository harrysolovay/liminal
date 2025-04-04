import type { ActionEvents } from "./ActionEvents.ts"
import type { EnableTool } from "./actions/EnableTool.ts"
import type { Message } from "./actions/messages.ts"
import type { RunEmbed } from "./actions/SetEmbeddingModel.ts"
import type { RunInfer, RunInferStream } from "./actions/SetLanguageModel.ts"

export type ScopeSource = "exec" | "isolate" | "tool" | "fork" | "fork_arm" | "set_messages"

export class Scope<R = any> {
  constructor(
    readonly source: ScopeSource,
    readonly args: Record<keyof any, any>,
    readonly key: keyof any | undefined,
    readonly events: ActionEvents,
    public runInfer: RunInfer | undefined = undefined,
    public runEmbed: RunEmbed | undefined = undefined,
    public runInferStream: RunInferStream | undefined = undefined,
    readonly messages: Array<Message> = [],
    readonly tools: Set<EnableTool> = new Set(),
    public next: any = undefined,
    public result: R = undefined!,
    public children: Array<Scope> = [],
  ) {}

  toJSON() {
    const { messages, key, events, children, result } = this
    return {
      key,
      events,
      children,
      result,
      ...messages.length ? { messages } : {},
    }
  }

  spread = (fields?: Partial<Scope<R>>): Scope<R> => {
    return new Scope(
      fields?.source ?? this.source,
      fields?.args ?? this.args,
      fields?.key ?? this.key,
      fields?.events ?? this.events,
      fields?.runInfer ?? this.runInfer,
      fields?.runEmbed ?? this.runEmbed,
      fields?.runInferStream ?? this.runInferStream,
      fields?.messages ?? this.messages,
      fields?.tools ?? this.tools,
      fields?.next ?? this.next,
      fields?.result ?? this.result,
      fields?.children ?? this.children,
    )
  }
}
