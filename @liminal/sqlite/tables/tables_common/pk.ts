import { text } from "drizzle-orm/sqlite-core"

export const pk = () => text().primaryKey().$defaultFn(crypto.randomUUID)
