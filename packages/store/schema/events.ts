import { pgTable, uuid } from "drizzle-orm/pg-core"
import { Pk } from "./schema_common/Pk.js"
import { agents } from "./agents.js"

export const events = pgTable("events", {
  id: Pk(),
  agentId: uuid()
    .references(() => agents.id)
    .notNull(),
})
