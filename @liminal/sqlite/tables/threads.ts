import { relations } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { events } from "./events.ts"
import { pk } from "./tables_common/pk.ts"

export const threads = sqliteTable("threads", {
  id: pk(),
  system: text(),
  parent: text(),
  head: text(),
})

export const threadsRelations = relations(threads, ({ one }) => ({
  parent: one(threads, {
    fields: [threads.parent],
    references: [threads.id],
  }),
  head: one(events, {
    fields: [threads.head],
    references: [events.id],
  }),
}))
