// @egts:skip

import "@std/dotenv/load"
import { L, Liminal, OllamaAdapter } from "liminal"
import { Ollama } from "ollama"
import { dbg } from "testing"

const $ = Liminal(OllamaAdapter({
  ollama: new Ollama(),
  defaultModel: "llama3.2",
}))

const Contradiction = L.string`A reason to be sad.`(
  L.assert`Is a reason to be happy.`,
)

await $.value(Contradiction).then(dbg)
