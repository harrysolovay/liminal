import type { Action } from "../Action/Action.js"
import type { Agent } from "../Action/Agent.js"
import type { Model } from "../Action/Requirement.js"

export type ExtractModelKey<Y extends Action> = Extract<Y, Model>["key"] | Extract<Y, Agent>["M"]
