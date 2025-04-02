// import { _util, ActionBase, type JSONObject, type LanguageModelAdapter, type Message } from "liminal"

// export function OllamaLanguageModel(ollama: Ollama, model: string): LanguageModelAdapter {
//   return {
//     type: "Language",
//     reduceInference: async (scope, action) => {
//       const { messages: liminalMessages } = scope
//       const messages = liminalMessages.map(toOllamaMessage)
//       if (action.type) {
//         const schema = await _util.JSONSchemaMemo(action.type)
//         const { message } = await ollama.chat({
//           model,
//           messages,
//           format: schema,
//         })
//         const object: JSONObject = JSON.parse(message.content)
//         scope.events.emit({
//           type: "inferred",
//           value: object as JSONObject,
//         })
//         const content = JSON.stringify(object, null, 2)
//         scope.events.emit({
//           type: "assistant_messaged",
//           content,
//         })
//         return scope.spread({
//           messages: [
//             ...liminalMessages,
//             ActionBase("assistant_message", { content }),
//           ],
//           next: object,
//         })
//       }
//       const { message: { content } } = await ollama.chat({
//         model,
//         messages,
//       })
//       scope.events.emit({
//         type: "inferred",
//         value: content,
//       })
//       scope.events.emit({
//         type: "assistant_messaged",
//         content,
//       })
//       return scope.spread({
//         messages: [
//           ...liminalMessages,
//           ActionBase("assistant_message", { content }),
//         ],
//         next: content,
//       })
//     },
//   }
// }

// function toOllamaMessage(message: Message): OllamaMessage {
//   switch (message.action) {
//     case "assistant_message": {
//       return {
//         role: "assistant",
//         content: JSON.stringify(message.content),
//       }
//     }
//     case "system_message": {
//       return {
//         role: "system",
//         content: message.content,
//       }
//     }
//     case "tool_message": {
//       return {
//         role: "tool",
//         content: JSON.stringify(message.content),
//       }
//     }
//     case "user_message": {
//       return {
//         role: "user",
//         content: JSON.stringify(message.content),
//       }
//     }
//   }
// }
