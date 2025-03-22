import { openai } from "@ai-sdk/openai"
import { workers } from "../workers.js"
import { AIExec } from "liminal-ai"

AIExec.exec(workers, {
  models: {
    default: openai("gpt-4o-mini"),
  },
  handler(event) {
    if (event.type === "AgentEvent") {
      if (event.event.type === "BranchEvent") {
        if (event.event.event.type === "AgentEvent") {
          if (event.event.event.event.type === "Emit") {
            event.event.event.event.value
          }
        }
      }
    }
  },
}).then(console.log)
