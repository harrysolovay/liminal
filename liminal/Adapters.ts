import type { ActionReducer } from "./reduce/ActionReducer.js"
import type { Embedding } from "./Action/Embedding.js"
import type { Generation } from "./Action/Generation.js"

export type LanguageModelAdapter = ActionReducer<Generation>

export type EmbeddingModelAdapter = ActionReducer<Embedding>
