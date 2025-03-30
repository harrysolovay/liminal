import { pgTable, uuid } from "drizzle-orm/pg-core"
import { agents } from "./agents.js"
import { Pk } from "./schema_common/Pk.js"

export const events = pgTable("events", {
  id: Pk(),
  agentId: uuid()
    .references(() => agents.id)
    .notNull(),
})
