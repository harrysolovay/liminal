import { StrictMode } from "react"
import { PGlite } from "@electric-sql/pglite"
import { live } from "@electric-sql/pglite/live"
import { createRoot } from "react-dom/client"
import { App } from "./App.js"
import {} from "liminal-store"
import { PGliteProvider } from "@electric-sql/pglite-react"
import { vector } from "@electric-sql/pglite/vector"
import { auto_explain } from "@electric-sql/pglite/contrib/auto_explain"
import { fuzzystrmatch } from "@electric-sql/pglite/contrib/fuzzystrmatch"
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp"

const db = await PGlite.create({
  extensions: {
    auto_explain,
    fuzzystrmatch,
    live,
    uuid_ossp,
    vector,
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PGliteProvider {...{ db }}>
      <App />
    </PGliteProvider>
  </StrictMode>,
)
