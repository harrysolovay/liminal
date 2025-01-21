import type { Falsy } from "../util/Falsy.ts"

export interface Message {
  role: "user" | "assistant"
  body: string
  created: Date
}

export type MessageLike = Falsy | string | Message
