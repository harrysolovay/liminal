import { Schema } from "effect"

// ---cut---
import { AiTool, AiToolkit } from "@effect/ai"

export class DadJokeTools extends AiToolkit.make(
  AiTool.make("GetDadJoke", {
    description: "Get a hilarious dad joke from the ICanHazDadJoke API",
    success: Schema.String,
    failure: Schema.Never,
    parameters: {
      searchTerm: Schema.String.annotations({
        description: "The search term to use to find dad jokes",
      }),
    },
  }),
) {}
