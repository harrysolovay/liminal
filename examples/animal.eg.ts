import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "liminal"
import OpenAI from "openai"
import { dbg } from "testing"

const line = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const Dog = L.object({
  bark: L.string,
  favoriteToy: L.string,
})

const Elephant = L.object({
  troopId: L.number,
  remembersYourFace: L.boolean,
})

const Animal = L.TaggedUnion({
  Dog,
  Elephant,
  SlowLoris: null,
})

const animal = await line.value(Animal).then(dbg)

await Animal.assert(animal)
