import { L, LEvent, type Rune } from "liminal"
import "liminal-arktype/register"
import { type } from "arktype"

export interface ExpandConfig {
  input: string
  goals: Array<string>
  size?: number
}

export interface ExpandResult {
  expansions: Array<string>
  expanded: string
}

export function expand({ goals, input, size }: ExpandConfig): L.strand<Rune<LEvent>, ExpandResult> {
  return L.strand(function*() {
    L.system`
      You are given an idea, concept, or other arbitrary input. Your job is as follows:

      1. Propose the most relevant ways that the input can be expanded upon
        (potentially based on goals, which may or may not be specified).
        You may be asked to go through many iterations of proposing different
        avenues for expansion.
      2. You will ultimately be asked to deep-dive into one one of your proposed
        points for expansion: Be extremely thorough but concise.
    `
    if (goals?.length) {
      yield* L.user`
        Before proposing avenues for expansion, I want you to know that my goals are as follows:

        ${goals.join("\n\n")}
      `
    }
    yield* L.user`
      The idea/concept/input that I want you to expand upon is the following:

      ${input}

      ---

      What are ${size ?? 4} ways in which this could be expanded upon?
    `
    const { ways } = yield* L.assistant(ExpansionAvenues)
    const expansions = yield* L.strand(ways.map(function*(way) {
      yield* L.user`In the context of the specified input, please elaborate on following avenue: ${way}`
      return yield* L.assistant
    }))
    const expanded = yield* L.strand(
      function*() {
        yield* L.system`
          I'm going to give you some initial text, followed by various additional texts,
          each of which expands on the initial text. Your job is to coalesce these expansion points
          into the initial text and produce a final, composite text that represents the best ideas ${
          goals?.length ? `in accordance with the following goals:\n\n ${goals.join("\n\n")}` : ""
        }. Do not preface it with any leading text such as "Here is the composite text:" –– instead, dive straight into the composite.`

        yield* L.user`
          ## Initial Text

          ${input}

          ## Expansions

          ${expansions.join("\n\n")}
        `
        return yield* L.assistant
      },
      { messages: undefined },
    )
    return { expansions, expanded } satisfies ExpandResult
  })
}

const ExpansionAvenues = type({ ways: "string[]" })
