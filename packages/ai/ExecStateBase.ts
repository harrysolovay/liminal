import { generateObject, generateText, jsonSchema, type CoreMessage } from "ai"
import {
  type Agent,
  type Assistant,
  type Branch,
  type Emit,
  LiminalUtil,
  type Model,
  type Action,
  type DisableTool,
  type Flow,
  type Tool,
} from "liminal"
import type { ExecConfig } from "./ExecConfig.js"
import type { ExecState } from "./ExecState.js"
import { toJSONSchema } from "standard-json-schema"

export abstract class ExecStateBase<K extends string, S> {
  config: ExecConfig
  kind: K
  source: S
  flow: Flow
  modelKey: keyof any
  messages: Array<CoreMessage>
  tools: Set<Tool>
  system: string | undefined
  next: any
  parent?: ExecState
  constructor(
    config: ExecConfig,
    kind: K,
    source: S,
    flow: Flow,
    modelKey: keyof any,
    messages: Array<CoreMessage>,
    tools: Set<Tool>,
    system: string | undefined,
  ) {
    this.config = config
    this.kind = kind
    this.source = source
    this.flow = flow
    this.modelKey = modelKey
    this.messages = messages
    this.tools = tools
    this.system = system
  }

  async consume() {
    // ENTER
    let current = await this.flow.next(this.next)
    while (!current.done) {
      const { value } = current
      this.next = await this.tick(value)
      current = await this.flow.next(this.next)
    }
    // EXIT
  }

  async tick(action: Action) {
    if (!action) {
      return
    }
    if (typeof action === "string") {
      return this.onUserText(action)
    } else if (Array.isArray(action)) {
      return this.onUserTexts(action)
    } else {
      switch (action.kind) {
        case "Assistant": {
          return await this.onAssistant(action)
        }
        case "Model": {
          return this.onModel(action)
        }
        case "Emit": {
          return this.onEmit(action)
        }
        case "Branch": {
          return await this.onBranch(action)
        }
        case "Agent": {
          return await this.onAgent(action)
        }
        case "ParentContext": {
          return this.onParentContext()
        }
        case "Context": {
          return this.onContext()
        }
        case "AgentTool":
        case "UnitTool": {
          return this.onTool(action)
        }
        case "DisableTool": {
          return this.onDisableTool(action)
        }
      }
    }
  }

  onUserText(content: string) {
    this.messages.push({
      role: "user",
      content,
    })
  }

  onUserTexts(contents: Array<string>) {
    this.messages.push(
      ...contents.map(
        (content) =>
          ({
            role: "user",
            content,
          }) satisfies CoreMessage,
      ),
    )
  }

  async onAssistant(assistant: Assistant) {
    const { messages, system, modelKey } = this
    const model = this.config.models[modelKey]
    LiminalUtil.assert(model)
    if (assistant.type) {
      const schema = await toJSONSchema(assistant.type).then(jsonSchema)
      const { object } = await generateObject({
        system,
        model,
        messages,
        schema,
      })
      this.config.handler?.({
        type: "Assistant",
        object: object as object,
        schema,
      })
      return object
    } else {
      const { text } = await generateText({
        system,
        model,
        messages,
      })
      this.config.handler?.({
        type: "Assistant",
        text,
      })
      return text
    }
  }

  onModel(model: Model) {
    this.config.handler?.({
      type: "Model",
      model: model.key,
    })
    this.modelKey = model.key
  }

  onEmit(emit: Emit) {
    this.config.handler?.({
      type: "Emit",
      value: emit.value,
    })
  }

  onBranch(branch: Branch) {}

  onAgent(agent: Agent) {
    // new ExecState(config, flow, modelKey, [...messages], this, agent.instructions, new Set())
  }

  onParentContext() {
    return "parent" in this && this.parent ? [...this.parent.messages] : undefined
  }

  onContext() {
    return [...this.messages]
  }

  onTool(tool: Tool) {
    this.config.handler?.({
      type: "EnableTool",
      key: tool.key,
    })
    this.tools.add(tool)
    return function* (): Generator<DisableTool, void> {
      yield {
        kind: "DisableTool",
        tool,
      }
    }
  }

  onDisableTool(disableTool: DisableTool) {
    this.config.handler?.({
      type: "DisableTool",
      key: disableTool.tool.key,
    })
    this.tools.delete(disableTool.tool)
  }
}
