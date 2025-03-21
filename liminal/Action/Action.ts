import type { Branch } from "./Branch.js"
import type { AssistantText } from "./AssistantText.js"
import type { Emit } from "./Emit.js"
import type { AssistantObject } from "./AssistantValue.js"
import type { Model } from "./Model.js"
import type { Agent } from "./Agent.js"

export type Action = Agent | Model | Emit | Branch | string | AssistantText | AssistantObject
