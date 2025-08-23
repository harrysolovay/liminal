import { Message } from "@effect/ai/AiInput"
import { type SQLiteColumn, sqliteTable, text } from "drizzle-orm/sqlite-core"
import type * as Schema from "effect/Schema"
import { events } from "./events.ts"
import { pk } from "./tables_common/pk.ts"
import { threads } from "./threads.ts"

export const messages = sqliteTable("messages", {
  parentId: text().references((): SQLiteColumn => messages.id),
  id: pk(),
  threadId: text().notNull().references((): SQLiteColumn => threads.id),
  message: text({ mode: "json" }).notNull().$type<Schema.Schema.Encoded<typeof Message>>(),
  eventId: text().references((): SQLiteColumn => events.id).notNull(),
})
