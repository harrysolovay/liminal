import { pgTable } from "drizzle-orm/pg-core"
import { Pk } from "./schema_common/Pk.js"

export const agents = pgTable("agents", {
  id: Pk(),
})
