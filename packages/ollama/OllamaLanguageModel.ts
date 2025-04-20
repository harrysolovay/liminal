// import { _util, type JSONKey, L, type LanguageModel, type Message, Tool } from "liminal"
// import type { Message as OllamaMessage, Ollama, Tool as OllamaTool } from "ollama"

// export function OllamaLanguageModel(ollama: Ollama, model: string): LanguageModel {
//   return {
//     type: "language",
//     vendor: "ollama",
//     async *infer(type) {
//       const messages = [...yield* L.messages].map(toOllamaMessage)
//       const { tools: ollamaTools, callbacks } = yield* OllamaToolCtx()
//       if (type) {
//         const schema = await _util.JSONSchemaMemo(type)
//         let { message } = await ollama.chat({
//           model,
//           messages,
//           format: schema,
//           ...ollamaTools && { tools: ollamaTools },
//         })
//         yield* L.assistant(JSON.stringify(message, null, 2))
//         yield* toolLoop(ollama, model, message, callbacks)
//         yield* L.assistant(message.content)
//         const parsed = JSON.parse(message.content)
//         // TODO: re-enable this
//         // const validateResult = await type["~standard"].validate(parsed)
//         // _util.assert(!validateResult.issues)
//         // return validateResult.value
//         return parsed
//       }
//       const { message } = await ollama.chat({
//         model,
//         messages,
//         ...ollamaTools && { tools: ollamaTools },
//       })
//       yield* toolLoop(ollama, model, message, callbacks)
//       yield* L.assistant(message.content)
//       return message.content
//     },
//   }
// }

// function toOllamaMessage(message: Message): OllamaMessage {
//   switch (message.role) {
//     case "assistant": {
//       return {
//         role: "assistant",
//         content: JSON.stringify(message.content),
//       }
//     }
//     case "system": {
//       return {
//         role: "system",
//         content: message.content,
//       }
//     }
//     case "tool": {
//       return {
//         role: "tool",
//         content: JSON.stringify(message.content),
//       }
//     }
//     case "user": {
//       return {
//         role: "user",
//         content: typeof message.content === "string" ? message.content : JSON.stringify(message.content),
//       }
//     }
//   }
// }

// async function* OllamaToolCtx() {
//   const tools = yield* L.tools
//   let toolsPending: undefined | Array<Promise<OllamaTool>> = []
//   const callbacks: Record<JSONKey, Tool> = {}
//   if (tools.size) {
//     toolsPending = []
//     const scope = yield* L.scope
//     scope.tools.forEach((tool) => {
//       callbacks[String(tool.toolKey)] = tool
//       toolsPending!.push((async (): Promise<OllamaTool> => {
//         const parameters: OllamaTool["function"]["parameters"] = await _util.JSONSchemaMemo(tool.params) as never
//         return {
//           type: "function",
//           function: {
//             name: String(tool.toolKey),
//             description: tool.description,
//             parameters,
//           },
//         }
//       })())
//     })
//   }
//   return {
//     tools: toolsPending ? await Promise.all(toolsPending) : undefined,
//     callbacks,
//   }
// }

// async function* toolLoop(
//   ollama: Ollama,
//   model: string,
//   message: OllamaMessage,
//   callbacks: Record<JSONKey, Tool>,
// ) {
//   while (message.tool_calls?.length) {
//     for (const tool of message.tool_calls ?? []) {
//       const f = callbacks[tool.function.name]
//       _util.assert(f)
//       const scope = yield* L.scope
//       const executor = f.executor(scope)
//       const returned = await executor(tool.function.arguments)
//       // TODO
//       yield* L.appendMessage("tool", JSON.stringify(returned, null, 2) as never)
//     }
//     ;({ message } = await ollama.chat({
//       model,
//       messages: [...yield* L.messages].map(toOllamaMessage),
//     }))
//   }
// }
