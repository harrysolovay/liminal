import { Message } from "@effect/ai/AiInput"
import { type SQLiteColumn, sqliteTable, text } from "drizzle-orm/sqlite-core"
import type * as Schema from "effect/Schema"
import { events } from "./events.ts"
import { pk } from "./tables_common/pk.ts"
import { threads } from "./threads.ts"

export const messages = sqliteTable("messages", {
  previousMessageId: text(),
  messageId: pk(),
  threadId: text().notNull().references((): SQLiteColumn => threads.threadId),
  message: text({ mode: "json" }).notNull().$type<Schema.Schema.Encoded<typeof Message>>(),
  eventId: text().references((): SQLiteColumn => events.eventId).notNull(),
})
