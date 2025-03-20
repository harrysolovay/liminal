import type { Branch } from "./Branch.js"
import type { AssistantText } from "./AssistantText.js"
import type { Emit } from "./E.js"
import type { AssistantValue } from "./AssistantValue.js"
import type { Model } from "./Requirement.js"
import type { Agent } from "./Agent.js"

export type Action = Propagated | string | AssistantText | AssistantValue

export type Propagated = Agent | Model | Emit | Branch
