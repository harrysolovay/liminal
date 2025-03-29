import type { ActionReducer } from "./Action/ActionReducer.js"
import type { Embedding } from "./Embedding/Embedding.js"
import type { Generation } from "./Generation/Generation.js"

export type LanguageModelAdapter = ActionReducer<Generation>

export type EmbeddingModelAdapter = ActionReducer<Embedding>
