import type { Branches } from "../Branches/Branches.js"
import type { Context } from "../Context/Context.js"
import type { CurrentScope } from "../CurrentScope/CurrentScope.js"
import type { Embedding } from "../Embedding/Embedding.js"
import type { Emission } from "../Emission/Emission.js"
import type { Inference } from "../Generation/Generation.js"
import type { Message } from "../Message/Message.js"
import type { Model } from "../Model/Model.js"
import type { Tool } from "../Tool/Tool.js"
import type { ToolRemoval } from "../ToolRemoval/ToolRemoval.js"

export type Action =
  | Context
  | Model
  | Emission
  | Branches
  | Inference
  | Embedding
  | Tool
  | ToolRemoval
  | CurrentScope
  | Message
