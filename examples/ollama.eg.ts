import "@std/dotenv/load"
import { L, Liminal, OllamaAdapter } from "liminal"
import { Ollama } from "ollama"
import { dbg } from "testing"

const $ = Liminal(OllamaAdapter({
  ollama: new Ollama(),
  defaultModel: "llama3.2",
}))

$`Ollama is 22 years old and busy saving the world. Return a JSON object with the age and availability.`

const T = L.object({
  age: L.number,
  available: L.boolean,
})

const t = await $.value(T).then(dbg)

// @egts:cut
await T.assert(t)
