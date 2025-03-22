import type { Branch } from "./Branch.js"
import type { Assistant } from "./Assistant.js"
import type { Emit } from "./Emit.js"
import type { Model } from "./Model.js"
import type { Agent } from "./Agent.js"
import type { Tool } from "./Tool.js"
import type { DisableTool } from "./DisableTool.js"

export type Action = Agent | Model | Emit | Branch | string | Assistant | Tool | DisableTool
