import { L, Liminal, type Type } from "liminal"
import "@std/dotenv/load"
import { OpenAIAdapter } from "liminal/openai"
import OpenAI from "openai"
import { dbg } from "testing"
import * as A from "./assertions.eg.ts"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const ColorHex: Type<string> = L.transform(
  L.Tuple.N(
    L.number(
      A.number.min(0),
      A.number.max(255),
    ),
    3,
  ),
  (rgb) => rgb.map((channel) => channel.toString(16).padStart(2, "0")).join(""),
)

await $(ColorHex).then(dbg)
