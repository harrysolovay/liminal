import { State } from "../Context.ts"
import type { Handler } from "../Handler.ts"

export const handlers: State<Set<Handler>> = State((parent) => new Set(parent))
