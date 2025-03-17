import { streamObject } from "ai"
import { z } from "zod"
import { openai } from "@ai-sdk/openai"

const { fullStream } = streamObject({
  model: openai("o3-mini"),
  prompt: "What is love?",
  schema: z.object({
    v: z.array(z.string().describe("Description of one aspect of love.")),
  }),
})

for await (const chunk of fullStream) {
  console.log(chunk)
}
