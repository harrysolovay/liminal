import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "liminal"
import { dbg } from "testing"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const Character = L.object({
  name: L.string,
  home: L.string`The name of a fictional realm of magic and wonder.`,
  disposition: L.enum("Optimistic", "Reserved", "Inquisitive"),
  age: L.number`Age of the character.`,
  friends: L.array(L.string)`Names of the character's friends.`,
})

const character = await $.value(Character).then(dbg)

await Character.assert(character)
