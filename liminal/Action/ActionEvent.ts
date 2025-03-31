import type { ContextEvent } from "../Context/ContextEvent.js"
import type { ModelDeclaredEvent } from "../DeclareModel/DeclareModelEvent.js"
import type { ToolDisabledEvent } from "../DisableTool/DisableToolEvent.js"
import type { EmbeddedEvent } from "../Embed/EmbedEvent.js"
import type { EmittedEvent } from "../Emit/EmitEvent.js"
import type {
  ToolEnabledEvent,
  ToolEnteredEvent,
  ToolExitedEvent,
  ToolInnerEvent,
} from "../EnableTool/EnableToolEvent.js"
import type { ExecEnteredEvent, ExecExitedEvent } from "../Exec/ExecEvent.js"
import type { ForkEvent } from "../Fork/ForkEvent.js"
import type { InferredEvent } from "../Infer/InferEvent.js"
import type { AssistantMessagedEvent } from "../Message/AssistantMessageEvent.js"
import type { SystemMessagedEvent } from "../Message/SystemMessageEvent.js"
import type { ToolMessagedEvent } from "../Message/ToolMessageEvent.js"
import type { UserMessagedEvent } from "../Message/UserMessageEvent.js"

export type ActionEvent =
  | ExecEnteredEvent
  | ExecExitedEvent
  | ContextEvent
  | ForkEvent
  | ToolEnabledEvent
  | ToolEnteredEvent
  | ToolInnerEvent
  | ToolExitedEvent
  | ToolDisabledEvent
  | EmbeddedEvent
  | EmittedEvent
  | InferredEvent
  | ModelDeclaredEvent
  | SystemMessagedEvent
  | UserMessagedEvent
  | AssistantMessagedEvent
  | ToolMessagedEvent
