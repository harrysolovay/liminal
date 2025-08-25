import { type SQLiteColumn, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { events } from "./events.ts"

export const threads = sqliteTable("threads", {
  id: text().notNull(),
  system: text(),
  parent: text().references((): SQLiteColumn => events.id),
  head: text().references((): SQLiteColumn => events.id),
  clearedAt: text().references((): SQLiteColumn => events.id),
})
