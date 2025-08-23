import { Message } from "@effect/ai/AiInput"
import * as Schema from "effect/Schema"

export const decode = Schema.decode(Message)
export const encode = Schema.encode(Message)
