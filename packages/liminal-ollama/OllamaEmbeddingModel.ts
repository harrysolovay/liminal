// import { _util, type EmbeddingModel } from "liminal"
// import type { Ollama } from "ollama"

// export function OllamaEmbeddingModel(ollama: Ollama, model: string): EmbeddingModel {
//   return {
//     type: "embedding",
//     vendor: "ollama",
//     embed: async (value) => {
//       const { embeddings } = await ollama.embed({
//         model,
//         input: value,
//       })
//       return embeddings[0]!
//     },
//   }
// }
