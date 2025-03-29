import type { Branches } from "../Branches/Branches.js"
import type { Embedding } from "../Embedding/Embedding.js"
import type { Generation } from "../Generation/Generation.js"
import type { CurrentState } from "../CurrentState/CurrentState.js"
import type { Emit } from "../Emit/Emit.js"
import type { Model } from "../Model/Model.js"
import type { Context } from "../Context/Context.js"
import type { ToolRemoval } from "../ToolRemoval/ToolRemoval.js"
import type { Tool } from "../Tool/Tool.js"
import type { Message } from "../Message/Message.js"

export type Action =
  | Context
  | Model
  | Emit
  | Branches
  | Generation
  | Embedding
  | Tool
  | ToolRemoval
  | CurrentState
  | Message
