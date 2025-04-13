import type { Action } from "./Action.ts"
import type { Agent } from "./Agent.ts"
import type { EventHandler } from "./events/EventHandler.ts"
import type { LEvent } from "./events/LEvent.ts"
import type { ExecConfig } from "./Exec.ts"
import type { Message } from "./Message.ts"
import type { EmbeddingModel, LanguageModel } from "./Model.ts"
import type { Tool } from "./Tool.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export type Scope = RootScope | ChildScope

export interface RootScope extends ScopeBase<RootScopeType> {}
export interface ChildScope extends ScopeBase<ChildScopeType> {
  readonly parent: Scope
}

export type RootScopeType = "root"
export type ChildScopeType = "catch" | "tool" | "branch" | "branch_arm" | "set_messages" | "run_section"
export type ScopeType = RootScopeType | ChildScopeType

export interface ScopeBase<Type extends ScopeType> {
  readonly type: Type
  readonly path: Array<JSONKey>
  readonly args?: Record<JSONKey, any> | undefined
  readonly controller: AbortController
  readonly messages: Set<Message>
  readonly tools: Set<Tool>
  readonly nextArg?: any
  readonly value: any
  readonly thrown?: any
  readonly languageModels: Set<LanguageModel>
  readonly embeddingModels: Set<EmbeddingModel>
  readonly handler?: EventHandler | undefined
  readonly childForkCounts: Record<JSONKey, number>
  readonly index: number
  readonly sections: Set<Section>

  reduce(agent: Agent): Promise<Scope>
  fork(
    source: ChildScopeType,
    subpath: Array<JSONKey>,
    overrides?: Partial<ChildScope>,
  ): Scope
  event(event: LEvent): void
}

export interface Section {
  sectionKey: JSONKey
  messages: Set<Message>
}

export function RootScope({
  signal,
  args,
  handler,
  default: defaultLanguageModel,
}: ExecConfig): RootScope {
  const controller = new AbortController()
  signal?.addEventListener("abort", () => {
    controller.abort()
  })
  return {
    type: "root",
    args,
    controller,
    messages: new Set(),
    tools: new Set(),
    value: undefined,
    path: [],
    languageModels: new Set([defaultLanguageModel]),
    embeddingModels: new Set(),
    childForkCounts: {},
    sections: new Set(),
    index: 0,
    reduce,
    fork,
    handler,
    event,
  }
}

async function reduce(this: Scope, agent: Agent): Promise<Scope> {
  const { signal } = this.controller
  let scope = { ...this }
  if (signal.aborted) return scope
  let value: unknown
  try {
    let current = await agent.next()
    while (!current.done) {
      const { value } = current
      if (signal.aborted) return scope
      scope = await (value as Action).reducer(scope)
      if (signal.aborted) return scope
      current = await agent.next(scope.nextArg)
    }
    value = current.value
  } catch (thrown: unknown) {
    scope.controller.abort(thrown)
  }
  return {
    ...scope,
    value,
    nextArg: undefined,
  }
}

function fork(
  this: Scope,
  type: ChildScopeType,
  subpath: Array<JSONKey>,
  overrides?: Partial<ChildScope>,
): ChildScope {
  const subpathStr = subpath.join(" ")
  let index = this.childForkCounts[subpathStr]
  if (typeof index === "number") {
    this.childForkCounts[subpathStr]! += 1
  } else {
    index = 0
    this.childForkCounts[subpathStr] = 1
  }
  const f: ChildScope = {
    type,
    controller: this.controller,
    args: this.args,
    messages: new Set(this.messages),
    tools: new Set(),
    languageModels: new Set(this.languageModels),
    embeddingModels: new Set(this.embeddingModels),
    childForkCounts: {},
    handler: this.handler,
    path: [...this.path, ...subpath],
    parent: this,
    value: undefined,
    index,
    sections: new Set(this.sections),
    reduce,
    fork,
    event,
    ...overrides ?? {},
  }
  f.event({ type: "forked" })
  return f
}

function event(this: ChildScope, event: LEvent): void {
  this.handler?.({
    scope: this.path,
    index: this.index,
    ...event,
  })
}
