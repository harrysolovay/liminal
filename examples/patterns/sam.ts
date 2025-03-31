import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { Branches, Context, Emission, Exec, Inference, Model, Tool } from "liminal"
import { AILanguageModel } from "liminal-ai"

const { result } = await Exec(Conversation)
  .models({
    default: AILanguageModel(openai("gpt-4o-mini")),
    A: AILanguageModel(openai("gpt-4o-mini")),
    B: AILanguageModel(openai("gpt-4o-mini")),
  })
  .exec((event) => {
    if (event.type === "BranchInner") {
      if (event.branch === "AgentA") {
        if (event.inner.type === "Emission") {
          event.inner.value
        }
      }
    }
  })

console.log(result)

function* Conversation() {
  yield* Model.language("default")
  yield "Hello, how are you?"
  const a = yield* Inference()
  yield "Make it sad"
  const b = yield* Inference(type({
    a: "string",
    b: "string",
  }))
  const { AgentA, AgentB } = yield* Branches("exploration", {
    *AgentA() {
      yield* Model.language("A")
      yield* Emission("my-event", {
        some: {
          data: "HERE",
        },
      })
      return yield* MyAgent()
    },
    *AgentB() {
      yield* Model.language("B")
      return yield* MyAgent()
    },
  })
  return [b, AgentA, AgentB]
}

function* MyAgent() {
  yield "Tell me your favorite algorithm."
  return yield* Inference()
}
