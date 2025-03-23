import { pgTable, uuid } from "drizzle-orm/pg-core"
import { Pk } from "./schema_common/Pk.js"
import { flows } from "./flows.js"

export const events = pgTable("events", {
  id: Pk(),
  flowId: uuid()
    .references(() => flows.id)
    .notNull(),
})
