import type { ExtractT } from "../util/ExtractT.js"
import type { ExtractY } from "../util/ExtractY.js"
import type { Action } from "./Action.js"
import type { Params, ParamsO } from "./Type/Params.js"

export declare function agent<E = never>(template: TemplateStringsArray, ...values: Array<string>): AgentBuilder<E>

export interface AgentBuilder<E> {
  <R>(f: (this: E) => R): AgentFactory<E, Extract<ExtractY<R>, Action>, ExtractT<R>>
  <R, P extends Params>(
    fields: P,
    f: (this: E, args: ParamsO<P>) => R,
  ): AgentFactory<E, Extract<ExtractY<R>, Action>, ExtractT<R>>
}

export type AgentFactory<E, Y extends Action, T> = (
  ...rest: [E] extends [never] ? [] : [env: E]
) => Generator<Agent<Y, T>, () => void, void>

export interface Agent<Y extends Action = Action, T = any> {
  Y?: Y
  T?: T
  kind: "Agent"
}
