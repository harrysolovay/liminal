import { State } from "../Context.ts"

export const signal: State<AbortSignal | undefined> = State((parent) => parent)
