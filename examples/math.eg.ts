import "@std/dotenv/load"
import "@std/dotenv/load"
import { L, Liminal, OllamaAdapter } from "liminal"
import { Ollama } from "ollama"
import { dbg } from "testing"

const $ = Liminal(
  OllamaAdapter({
    ollama: new Ollama(),
    defaultModel: "llama3.2",
  }),
)

const MathReasoning = L.object({
  steps: L.array(L.object({
    explanation: L.string,
    output: L.string,
  })),
  final_answer: L.string,
})

$(
  {
    role: "system",
    content: "You are a helpful math tutor. Guide the user through the solution step by step.",
  },
  "How can I solve 8x + 7 = -23?",
)

const reasoning = await $.value(MathReasoning).then(dbg)

await MathReasoning.assert(reasoning)
