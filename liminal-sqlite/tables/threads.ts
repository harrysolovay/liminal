import { type SQLiteColumn, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { events } from "./events.ts"
import { messages } from "./messages.ts"
import { pk } from "./tables_common/pk.ts"

export const threads = sqliteTable("threads", {
  threadId: pk(),
  system: text(),
  name: text(),
  createEventId: text().references((): SQLiteColumn => events.eventId),
  headMessageId: text().references((): SQLiteColumn => messages.messageId),
  headEventId: text().references((): SQLiteColumn => events.eventId),
})
