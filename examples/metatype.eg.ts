import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "liminal"
import { dbg } from "testing"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

$`Declare a type that describes the ontology of a magical story world.`
const World = await $.value(L.MetaType).then(dbg)

$`Generate the story world's data.`
const world = await $.value(World).then(dbg)

// @egts:cut-start
await L.MetaType.assert(World)
await World.assert(world)
// @egts:cut-end
