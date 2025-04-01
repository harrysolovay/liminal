// import { _util, type EmbeddingModelAdapter } from "liminal"
// import { Ollama } from "ollama"

// export function OllamaEmbeddingModel(ollama: Ollama, model: string): EmbeddingModelAdapter {
//   return {
//     type: "Embedding",
//     reduceEmbedding: async (scope, action) => {
//       scope.events.emit({
//         type: "embedding_requested",
//         value: action.value,
//       })
//       const { embeddings } = await ollama.embed({
//         model,
//         input: action.value,
//       })
//       const embedding = embeddings[0]! // TODO
//       scope.events.emit({
//         type: "embedded",
//         value: action.value,
//         embedding,
//       })
//       return scope.spread({
//         next: embedding,
//       })
//     },
//   }
// }
