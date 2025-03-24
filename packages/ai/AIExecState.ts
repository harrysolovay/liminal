import { generateObject, generateText, jsonSchema, type CoreMessage } from "ai"
import {
  Assistant,
  type Context,
  type Branch,
  type Emit,
  _util,
  type Model,
  type Action,
  type DisableTool,
  type Agent,
  type Tool,
  type Event,
  type AgentLike,
} from "liminal"
import type { AIExecConfig } from "./AIExecConfig.js"
import { toJSONSchema } from "standard-json-schema"

export type AgentSource = AgentLike | _util.DeferredOr<Context | Branch> | Tool

export class AIExecState {
  config: AIExecConfig
  source: AgentSource
  agent: Agent
  modelKey: keyof any
  messages: Array<CoreMessage>
  tools: Set<Tool>
  system: string | undefined
  next: any
  parent: AIExecState | undefined
  handler: (event: Event) => unknown
  constructor(
    parent: AIExecState | undefined,
    config: AIExecConfig,
    source: AgentSource,
    agent: Agent,
    modelKey: keyof any,
    messages: Array<CoreMessage>,
    tools: Set<Tool>,
    system: string | undefined,
    handler: (event: Event) => unknown,
  ) {
    this.parent = parent
    this.config = config
    this.source = source
    this.agent = agent
    this.modelKey = modelKey
    this.messages = messages
    this.tools = tools
    this.system = system
    this.handler = handler
  }

  async consume(): Promise<unknown> {
    this.handler({
      type: "Enter",
    })
    let current = await this.agent.next(this.next)
    while (!current.done) {
      const { value } = current
      this.next = await this.tick(value)
      current = await this.agent.next(this.next)
    }
    this.handler({
      type: "Exit",
      result: current.value,
    })
    return current.value
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
          return await this.onContext(action)
        }
        case "Messages": {
          return this.onMessages()
        }
        case "Tool": {
          return this.onTool(action)
        }
        case "DisableTool": {
          return this.onDisableTool(action)
        }
      }
    }
  }

  onUserText(text: string) {
    this.handler({
      type: "UserText",
      text,
    })
    this.messages.push({
      role: "user",
      content: text,
    })
  }

  onUserTexts(texts: Array<string>) {
    for (const text of texts) {
      this.handler({
        type: "UserText",
        text,
      })
    }
    this.messages.push(
      ...texts.map(
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
    _util.assert(model)
    if (assistant.type) {
      const schema = await toJSONSchema(assistant.type)
      const aiSchema = jsonSchema(schema)
      const { object } = await generateObject({
        system,
        model,
        messages,
        schema: aiSchema,
      })
      this.messages.push({
        role: "assistant",
        content: JSON.stringify(object),
      })
      this.handler({
        type: "Assistant",
        value: object,
        schema,
      })
      return object
    } else {
      const { text } = await generateText({
        system,
        model,
        messages,
      })
      this.messages.push({
        role: "assistant",
        content: text,
      })
      this.handler({
        type: "Assistant",
        value: text,
      })
      return text
    }
  }

  onModel(model: Model) {
    this.handler({
      type: "Model",
      model: model.key,
    })
    this.modelKey = model.key
  }

  onEmit(emit: Emit) {
    this.handler({
      type: "Emit",
      event: emit.key,
      value: emit.value,
    })
  }

  async onBranch({ branches }: Branch) {
    const entries = Object.entries(branches)
    const result = await Promise.all(
      entries.map(([key, agentLike]) => {
        const unwrapped = _util.unwrapDeferred(agentLike)
        return new AIExecState(
          this,
          this.config,
          agentLike,
          unwrapped,
          this.modelKey,
          [...this.messages],
          new Set(this.tools),
          this.system,
          (event) =>
            this.handler({
              type: "Branch",
              branch: key,
              event,
            }),
        ).consume()
      }),
    )
    return Array.isArray(branches) ? result : Object.fromEntries(result.map((value, i) => [value, entries[i]]))
  }

  onContext(agent: Context) {
    return new AIExecState(
      this,
      this.config,
      agent,
      agent.implementation?.() ?? Assistant(),
      this.modelKey,
      [...this.messages],
      new Set(),
      agent.system,
      (event) =>
        this.handler({
          type: "Agent",
          agent: agent.key,
          system: agent.system,
          event,
        }),
    ).consume()
  }

  onMessages() {
    return [...this.messages]
  }

  onTool(tool: Tool) {
    this.handler({
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
    this.handler({
      type: "DisableTool",
      key: disableTool.tool.key,
    })
    this.tools.delete(disableTool.tool)
  }
}
