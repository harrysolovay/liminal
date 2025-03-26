import { reduceGeneration } from "./reduceGeneration.js"
import { reduceEmbedding } from "./reduceEmbedding.js"
import { EmbeddingModelAdapter, LanguageModelAdapter } from "liminal"

export const LM = LanguageModelAdapter(reduceGeneration)

export const EM = EmbeddingModelAdapter(reduceEmbedding)
