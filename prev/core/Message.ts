import type { Falsy } from "../../util/Falsy.ts"

export type MessageLike = Falsy | string | Message

export interface Message {
  role: "system" | "user" | "assistant"
  body: string
  created: Date
}
