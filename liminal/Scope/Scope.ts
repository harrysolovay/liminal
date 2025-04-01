import type { EnableTool } from "../EnableTool/EnableTool.ts"
import type { Events } from "../Events.ts"
import type { Message } from "../Message.ts"
import type { RunEmbed } from "../SetEmbeddingModel/SetEmbeddingModel.ts"
import type { RunInfer } from "../SetLanguageModel/SetLanguageModel.ts"

export class Scope<R = any> {
  constructor(
    readonly args: Record<keyof any, any>,
    readonly key: keyof any | undefined,
    readonly events: Events,
    public infer: RunInfer | undefined = undefined,
    public embed: RunEmbed | undefined = undefined,
    readonly messages: Array<Message> = [],
    readonly tools: Set<EnableTool> = new Set(),
    public next: any = undefined,
    public result: R = undefined!,
    public children: Array<ChildScopeContainer> = [],
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
      fields?.args ?? this.args,
      fields?.key ?? this.key,
      fields?.events ?? this.events,
      fields?.infer ?? this.infer,
      fields?.embed ?? this.embed,
      fields?.messages ?? this.messages,
      fields?.tools ?? this.tools,
      fields?.next ?? this.next,
      fields?.result ?? this.result,
      fields?.children ?? this.children,
    )
  }
}

// TODO: how to capture tool scope?
export type ChildScopeContainer = {
  type: "context"
  scope: Scope
} | {
  type: "fork"
  key: keyof any
  scopes: Record<keyof any, Scope>
}
