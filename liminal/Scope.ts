import type { Action } from "./Action.ts"
import type { Actor } from "./Actor.ts"
import type { EventHandler } from "./events/EventHandler.ts"
import type { LEvent } from "./events/LEvent.ts"
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
export type ChildScopeType = "catch" | "tool" | "branch" | "branch_arm" | "set_messages"
export type ScopeType = RootScopeType | ChildScopeType

export interface ScopeBase<Type extends ScopeType> {
  readonly type: Type
  readonly path: Array<JSONKey>
  readonly args?: Record<JSONKey, any>
  readonly controller: AbortController
  readonly messages: Set<Message>
  readonly tools: Set<Tool>
  readonly nextArg?: any
  readonly value: any
  readonly thrown?: any
  readonly languageModels: Set<LanguageModel>
  readonly embeddingModels: Set<EmbeddingModel>
  readonly handler?: EventHandler

  reduce(actor: Actor): Promise<Scope>
  fork(source: ChildScopeType, subpath: Array<JSONKey>): Scope
  event(event: LEvent): void
}

export function RootScope(
  defaultLanguageModel: LanguageModel,
  args?: Record<JSONKey, any>,
  handler: EventHandler = () => {},
  signal?: AbortSignal,
): RootScope {
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
    reduce,
    fork,
    handler,
    event,
  }
}

async function reduce(this: Scope, actor: Actor): Promise<Scope> {
  const { signal } = this.controller
  let scope = { ...this }
  if (signal.aborted) return scope
  let value: unknown
  try {
    let current = await actor.next()
    while (!current.done) {
      const { value } = current
      if (signal.aborted) return scope
      scope = await (value as Action).reducer(scope)
      if (signal.aborted) return scope
      current = await actor.next(scope.nextArg)
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

function fork(this: Scope, type: ChildScopeType, subpath: Array<JSONKey>): ChildScope {
  const f: ChildScope = {
    type,
    controller: this.controller,
    args: this.args,
    messages: new Set(this.messages),
    tools: new Set(),
    languageModels: new Set(this.languageModels),
    embeddingModels: new Set(this.embeddingModels),
    handler: this.handler,
    path: [...this.path, ...subpath],
    parent: this,
    value: undefined,
    reduce,
    fork,
    event,
  }
  f.event({ type: "forked" })
  return f
}

function event(this: ChildScope, event: LEvent): void {
  this.handler?.({
    scope: this.path,
    ...event,
  })
}
