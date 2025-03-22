import type { Branch } from "./Branch.js"
import type { Assistant } from "./Assistant.js"
import type { Emit } from "./Emit.js"
import type { Model } from "./Model.js"
import type { Agent } from "./Agent.js"

export type Action = Agent | Model | Emit | Branch | string | Assistant
