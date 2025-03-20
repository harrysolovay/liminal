import type { Branch } from "./Branch.js"
import type { AssistantText } from "./AssistantText.js"
import type { E } from "./E.js"
import type { AssistantValue } from "./AssistantValue.js"
import type { Requirement } from "./Requirement.js"
import type { Agent } from "./Agent.js"

export type Action = Propagated | string | AssistantText | AssistantValue

export type Propagated = Agent | Requirement | E | Branch
