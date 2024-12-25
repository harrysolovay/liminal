// @egts:skip

import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "liminal"
import OpenAI from "openai"
import { dbg } from "testing"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const Character = L.MetaType`A character of a superhero story.`

const Hero = $.value(Character`The superhero.`)
const Villain = $.value(Character`The supervillain.`)
const Civilian = $.value(Character`Civilians.`)
const Sidekick = $.value(Character`The sidekick.`)

const Archetypes = L.Tuple(...await Promise.all([Hero, Villain, Civilian, Sidekick]))

await $.value(Archetypes).then(dbg)
