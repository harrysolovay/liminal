import type { Strand } from "./Strand.ts"

export type Handler<E = any> = (this: Strand, event: E) => void
