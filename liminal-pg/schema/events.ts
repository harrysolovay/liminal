import { jsonb, pgTable, text } from "drizzle-orm/pg-core"
import type * as Schema from "effect/Schema"
import type { LEvent } from "liminal"
import { Pk } from "./schema_common/Pk.ts"

export const events = pgTable("events", {
  eventId: Pk(),
  thread: text().notNull(),
  event: jsonb("event").$type<Schema.Schema.Encoded<typeof LEvent>>(),
})
