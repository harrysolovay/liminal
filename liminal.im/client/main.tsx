import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./global.css"
import { ClerkProvider } from "@clerk/clerk-react"
import { Schema } from "effect"
import { App } from "./App.tsx"

const publishableKey = Schema.decodeUnknownSync(Schema.String)(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider afterSignOutUrl="/" {...{ publishableKey }}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
