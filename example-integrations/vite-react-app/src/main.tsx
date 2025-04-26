import type { PGlite, PGliteInterfaceExtensions } from "@electric-sql/pglite"
import { makePGliteProvider } from "@electric-sql/pglite-react"
import { PGliteWorker } from "@electric-sql/pglite/worker"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App.tsx"
import type { extensions } from "./pglite_worker.ts"

const pg = new PGliteWorker(
  new Worker(new URL("./pglite_worker.js", import.meta.url), {
    type: "module",
  }),
)

export const { PGliteProvider, usePGlite } = makePGliteProvider<
  & PGlite
  & PGliteInterfaceExtensions<typeof extensions>
>()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PGliteProvider db={pg as never}>
      <App />
    </PGliteProvider>
  </StrictMode>,
)
