import { L, LEvent, type Rune } from "liminal"

export interface SocraticConfig {
  topic: string
  rounds?: number
}

export interface SocraticTurn {
  speaker: "Socrates" | "Theaetetus"
  message: string
}

export interface SocraticResult {
  turns: SocraticTurn[]
}

export function socratic({ topic, rounds = 5 }: SocraticConfig): Generator<Rune<LEvent>, SocraticResult> {
  return L.strand(function*() {
    const turns: SocraticTurn[] = []
    L.system`
      You are about to participate in a Socratic dialogue between two AI personas: Socrates (the questioner) and Theaetetus (the answerer).
      Socrates will ask probing, philosophical questions. Theaetetus will attempt to answer thoughtfully.
      The topic is: ${topic}
      Alternate between Socrates asking a question and Theaetetus answering, for ${rounds} rounds.
      Format each message as <Socrates>...</Socrates> or <Theaetetus>...</Theaetetus>.
      Do not break character.
    `
    let lastAnswer = ""
    for (let i = 0; i < rounds; ++i) {
      // Socrates asks a question
      const question = yield* L.strand(function*() {
        yield* L.user`<Socrates>Ask a probing question about '${topic}'${
          i > 0 ? `, building on this answer: ${lastAnswer}` : ""
        }</Socrates>`
        return yield* L.assistant
      })
      turns.push({ speaker: "Socrates", message: question })
      // Theaetetus answers
      const answer = yield* L.strand(function*() {
        yield* L.user`<Theaetetus>Answer Socrates' question: ${question}</Theaetetus>`
        return yield* L.assistant
      })
      turns.push({ speaker: "Theaetetus", message: answer })
      lastAnswer = answer
    }
    return { turns }
  })
}
