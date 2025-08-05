import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./global.css"
import { App } from "@/App"
import { ClerkProvider } from "@clerk/clerk-react"
import * as Schema from "effect/Schema"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      afterSignOutUrl="/"
      publishableKey={Schema.decodeUnknownSync(Schema.String)(
        import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
      )}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
