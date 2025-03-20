import type { Branch } from "./Branch.js"
import type { AssistantText } from "./AssistantText.js"
import type { Emit } from "./Emit.js"
import type { AssistantValue } from "./AssistantValue.js"
import type { Model } from "./Model.js"
import type { Agent } from "./Agent.js"

export type Action = Propagated | string | AssistantText | AssistantValue

export type Propagated = Agent | Model | Emit | Branch
