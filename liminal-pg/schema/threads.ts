import { pgTable, text } from "drizzle-orm/pg-core"
import { Pk } from "./schema_common/Pk.ts"

export const threads = pgTable("threads", {
  threadId: Pk(),
  fqn: text(),
})
