import { sql } from "drizzle-orm"
import { integer, type SQLiteColumn, sqliteTable, text } from "drizzle-orm/sqlite-core"
import type * as Schema from "effect/Schema"
import type { LEvent } from "liminal"
import { pk } from "./tables_common/pk.ts"
import { threads } from "./threads.ts"

export const events = sqliteTable("events", {
  parentId: text().references((): SQLiteColumn => events.parentId),
  id: pk(),
  threadId: text().notNull().references((): SQLiteColumn => threads.id),
  event: text({ mode: "json" }).notNull().$type<Schema.Schema.Encoded<typeof LEvent>>(),
  timestamp: integer({ mode: "timestamp_ms" }).default(sql`(unixepoch() * 1000)`).notNull(),
})
