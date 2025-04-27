import { L } from "liminal"

export interface DebateConfig {
  topic: string
  debaters?: Array<{
    debaterId: string
    role: string
  }>
  rounds?: number | undefined
  goals?: Array<string> | undefined
}

export interface DebateResult {
  turns: Array<DebateTurn>
  summary: string
  winner: string
  rationale: string
}

export interface DebateTurn {
  debater: string
  argument: string
}

export function debate({
  topic,
  debaters = [
    { debaterId: "proponent", role: "Argue in favor" },
    { debaterId: "opponent", role: "Argue against" },
  ],
  rounds = 4,
  goals,
}: DebateConfig) {
  return L.strand(function*() {
    // Collects all arguments and rebuttals in the debate, in order
    const turns: Array<DebateTurn> = []

    // Set up the debate context and instructions for the agents
    L.system`
      You are about to participate in a debate. Each debater will present arguments and rebuttals on the following topic.
      The debate will be synthesized at the end. Each debater should be persuasive, thorough, and concise, and should stick
      to their assigned role. ${goals?.length ? `Debate goals:\n\n${goals.join("\n\n")}` : ""}
    `
    yield* L.user`
      The topic for debate is:
      ${topic}
      ---
      The debaters are:

      ${debaters.map((a) => `- ${a.debaterId}: ${a.role}`).join("\n")}

      The debate will proceed for ${rounds} round(s) of arguments and rebuttals.
    `

    // === Initial Arguments Phase ===
    // Each debater presents their initial argument
    for (const debater of debaters) {
      yield* L.user`
        ${debater.debaterId}, please present your initial argument.\nRole: ${
        debater.role ?? "No specific role"
      }\nTopic: ${topic}
      `
      const point = yield* L.strand(function*() {
        yield* L.user`Please reply as if you are ${debater.debaterId} with the role of ${debater.role}.`
        return yield* L.assistant
      })
      yield* L.user`Debater ${debater.debaterId} has presented their argument: ${point}`
      turns.push({
        debater: debater.debaterId,
        argument: point,
      })
    }

    // === Rebuttal Rounds ===
    // For each additional round, each debater rebuts the previous argument of their opponent
    for (let round = 1; round < rounds; round++) {
      for (let i = 0; i < debaters.length; i++) {
        const debater = debaters[i]!
        // Find the most recent argument from the opponent
        const opposing = turns.filter((arg) => arg.debater !== debater.debaterId)
        yield* L.user`
          ${debater.debaterId}, please rebut the following argument(s) from your opponent(s):\n\n${
          opposing.map((arg) => `${arg.debater}: ${arg.argument}`).join("\n\n")
        }\n\nBe concise and address the main points.
        `
        const point = yield* L.strand(function*() {
          yield* L.user`Please reply as if you are ${debater.debaterId} with the role of ${debater.role}.`
          return yield* L.assistant
        })
        yield* L.user`Debater ${debater.debaterId} has presented their rebuttal: ${point}`
        turns.push({
          debater: debater.debaterId,
          argument: point,
        })
      }
    }

    // === Synthesis Phase ===
    // Moderator synthesizes the debate and may select a winner
    const { summary, winner, rationale } = yield* L.strand(function*() {
      yield* L
        .system`As the debate moderator, your job is to synthesize the arguments and rebuttals presented by each debater.`
      const summary = yield* L.assistant
      yield* L.user`Who do you think won the debate? You must select one of the debaters without equivocation.`
      const winner = yield* L.assistant
      yield* L.user`Why do you think they won?`
      const rationale = yield* L.assistant
      return { summary, winner, rationale }
    })

    // === Return DebateResult ===
    // Includes all arguments, the synthesis, and the winner (if any)
    return { turns, summary, winner, rationale } satisfies DebateResult
  })
}
