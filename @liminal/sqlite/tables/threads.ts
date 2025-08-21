import { type SQLiteColumn, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { events } from "./events.ts"
import { pk } from "./tables_common/pk.ts"

export const threads = sqliteTable("threads", {
  id: pk(),
  system: text(),
  name: text(),
  parent: text().references((): SQLiteColumn => events.id),
  head: text().references((): SQLiteColumn => events.id),
  clearedAt: text().references((): SQLiteColumn => events.id),
})
