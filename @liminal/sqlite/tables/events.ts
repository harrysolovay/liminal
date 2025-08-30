import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import type * as Schema from "effect/Schema"
import type { LEvent } from "liminal"
import { pk } from "./tables_common/pk.ts"
import { threads } from "./threads.ts"

export const events = sqliteTable("events", {
  parentId: text(),
  id: pk(),
  threadId: text().notNull(),
  event: text({ mode: "json" }).notNull().$type<Schema.Schema.Encoded<typeof LEvent>>(),
  timestamp: integer({ mode: "timestamp_ms" }).default(sql`(unixepoch() * 1000)`).notNull(),
})

export const eventsRelations = relations(events, ({ one }) => ({
  parent: one(events, {
    fields: [events.parentId],
    references: [events.id],
  }),
  thread: one(threads, {
    fields: [events.threadId],
    references: [threads.id],
  }),
}))
