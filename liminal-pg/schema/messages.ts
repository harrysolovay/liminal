import { Message } from "@effect/ai/AiInput"
import { jsonb, pgTable } from "drizzle-orm/pg-core"
import type * as Schema from "effect/Schema"
import { Pk } from "./schema_common/Pk.ts"

export const messages = pgTable("messages", {
  messageId: Pk(),
  message: jsonb("message").$type<Schema.Schema.Encoded<typeof Message>>(),
})
