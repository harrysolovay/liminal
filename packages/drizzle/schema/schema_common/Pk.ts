import { sql } from "drizzle-orm"
import { uuid } from "drizzle-orm/pg-core"

export function Pk() {
  return uuid().primaryKey().default(sql`uuid_generate_v4()`)
}
