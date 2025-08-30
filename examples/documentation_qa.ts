import { Command, FileSystem } from "@effect/platform"
import { BunContext } from "@effect/platform-bun"
import { Effect, flow, Schema } from "effect"
import * as Console from "effect/Console"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"

// TODO: use this for actual docs
declare const LIB_DIR: string
declare const DOCS_DIR: string

Effect.gen(function*() {
  yield* L.user`I'm about to provide you with a repomix summary of the current codebase.`

  yield* Command.string(Command.make("bunx", "repomix", LIB_DIR))
  const fs = yield* FileSystem.FileSystem
  yield* L.user(fs.readFileString("repomix-output.xml"))

  const docPaths = yield* fs.readDirectory(DOCS_DIR)
  const suggestions = yield* Effect.all(docPaths.map(flow(
    Effect.fn(function*(docPath) {
      yield* L.user`
        Based on this provided repomix overview, please consider the document's
        effectiveness and potentially suggest improvements.

        Specifically I'd like to know:

        A. Is the document sufficient for the purposes of this library?
        B. If not, what suggestions do you have for improvement?

        The document:

        ${fs.readFileString(docPath)}
      `
      const maybeChanges = yield* L.assistantSchema(Schema.Option(
        Schema.Array(
          Schema.String.pipe(Schema.annotations({
            description: "Improvements to be made to the document.",
          })),
        ),
      ))
      return [docPath, maybeChanges] as const
    }),
    L.scoped(
      L.branch,
    ),
  )))

  yield* Console.log(suggestions)
}).pipe(
  L.scoped(
    L.thread,
  ),
  Effect.provide([ModelLive, BunContext.layer]),
  Effect.runFork,
)
