import { Message } from "@effect/ai/AiInput"
import { relations } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import type * as Schema from "effect/Schema"
import { events } from "./events.ts"
import { pk } from "./tables_common/pk.ts"
import { threads } from "./threads.ts"

export const messages = sqliteTable("messages", {
  parentId: text(),
  id: pk(),
  threadId: text().notNull(),
  message: text({ mode: "json" }).notNull().$type<Schema.Schema.Encoded<typeof Message>>(),
  eventId: text().notNull(),
})

export const messagesRelations = relations(messages, ({ one }) => ({
  parent: one(messages, {
    fields: [messages.parentId],
    references: [messages.id],
  }),
  thread: one(threads, {
    fields: [messages.threadId],
    references: [threads.id],
  }),
  event: one(events, {
    fields: [messages.eventId],
    references: [events.id],
  }),
}))
