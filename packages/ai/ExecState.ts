import type { Agent, AgentTool, Branch, FlowLike } from "liminal"
import { ExecStateBase } from "./ExecStateBase.js"

export class BranchExecState extends ExecStateBase<"BranchExecState", Branch> {}

export class FlowLikeExecState extends ExecStateBase<"FlowLikeExecState", FlowLike> {}

export class AgentExecState extends ExecStateBase<"AgentExecState", Agent> {}

export class AgentToolExecState extends ExecStateBase<"AgentToolExecState", AgentTool> {}

export type ExecState = AgentExecState | BranchExecState | AgentToolExecState | FlowLikeExecState
