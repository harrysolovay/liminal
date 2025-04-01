// import type { Adapter, EmbeddingModelAdapter, LanguageModelAdapter } from "./Adapters.ts"
// import type { Spec } from "./Spec.ts"
// import type { Expand } from "./util/Expand.ts"

// export type ModelAdapters = Record<keyof any, Adapter>

// export type ExtractModelAdapters<S extends Spec> = Expand<
//   & ([S["LanguageModel"]] extends [never] ? {}
//     : { [K in S["LanguageModel"]]: LanguageModelAdapter })
//   & ([S["EmbeddingModel"]] extends [never] ? {}
//     : { [K in S["EmbeddingModel"]]: EmbeddingModelAdapter })
// >
