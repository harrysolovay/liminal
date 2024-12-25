import { L, Liminal, OpenAIAdapter, type Type } from "liminal"
import "@std/dotenv/load"
import OpenAI from "openai"
import { dbg } from "testing"
import { max, min } from "./asserts.ts"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const ColorHex: Type<string> = L.transform(
  L.Tuple.N(
    L.number(min(0), max(255)),
    3,
  ),
  (rgb) => rgb.map((channel) => channel.toString(16).padStart(2, "0")).join(""),
)

const colorHex = await $.value(ColorHex).then(dbg)

await ColorHex.assert(colorHex)
