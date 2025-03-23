import { pgTable } from "drizzle-orm/pg-core"
import { Pk } from "./schema_common/Pk.js"

export const flows = pgTable("flows", {
  id: Pk(),
})
