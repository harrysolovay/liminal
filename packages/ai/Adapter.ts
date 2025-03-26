import { reduceGeneration } from "./reduceGeneration.js"
import { reduceEmbedding } from "./reduceEmbedding.js"
import { EmbeddingModelAdapter, LanguageModelAdapter } from "liminal"

export const language = LanguageModelAdapter(reduceGeneration)

export const embedding = EmbeddingModelAdapter(reduceEmbedding)
