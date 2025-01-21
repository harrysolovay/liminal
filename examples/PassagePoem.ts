import { directive, E, Exec, Thread, Type as L } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"

const text = await Deno.readTextFile(new URL("dracula.txt", import.meta.url))
const SAMPLE_LENGTH = 1000

for await (const e of Exec(Main())) {}

function* Main() {
  const x = yield* Thread.parallel(
    Thread.new("A", PassagePoem()),
    Thread.new("B", PassagePoem()),
    Thread.new("C", PassagePoem()),
  )
  // console.log(A, B, C)
}

function* PassagePoem() {
  yield* directive`You are a helpful assistant.`

  yield model(new OpenAI(), "gpt-4o-mini")

  yield "Summarize the following passage from Bram Stoker's Dracula."

  const start = Math.floor(Math.random() * (text.length - SAMPLE_LENGTH + 1))
  yield text.slice(start, start + SAMPLE_LENGTH)

  yield L.string

  yield "Use that summary to create a poem."

  const poem = yield* L.string

  const x = yield* Thread.branch("something", Inner())

  yield E("PassagePoem", poem)

  return "HELLO!"
}

function* Inner() {
  yield E("another", 2)
}
