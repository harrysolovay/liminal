import { PGlite } from "@electric-sql/pglite"
import { auto_explain } from "@electric-sql/pglite/contrib/auto_explain"
import { fuzzystrmatch } from "@electric-sql/pglite/contrib/fuzzystrmatch"
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp"
import { live } from "@electric-sql/pglite/live"
import { vector } from "@electric-sql/pglite/vector"
import { worker } from "@electric-sql/pglite/worker"

export const extensions = {
  auto_explain,
  fuzzystrmatch,
  live,
  uuid_ossp,
  vector,
}

worker({
  async init() {
    return await PGlite.create("idb://liminal-examples-vite-react-app", {
      extensions,
    })
  },
})
