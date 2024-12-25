import type { Falsy } from "@std/assert"
import type { AnyType } from "../core/mod.ts"
import type { Provider } from "./Adapter.ts"

export interface Timeline<P extends Provider> {
  parent?: Timeline<P>
  value: Array<P["I" | "O"]>
  hash: string
  next: (...texts: Array<MessageLike<P>>) => Timeline<P>
  lookup: Record<string, Timeline<P>> // for ranges
}

export type MessageLike<P extends Provider = Provider> =
  | Falsy
  | number
  | string
  | P["I" | "O"]
  | AnyType
