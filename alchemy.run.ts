import alchemy from "alchemy"
import { Document } from "alchemy/docs"
import "alchemy/fs"
import { join } from "node:path"
import { argv, cwd } from "node:process"

await using _ = alchemy("github:liminal", {
  phase: argv.includes("--destroy") ? "destroy" : "up",
  quiet: argv.includes("--verbose") ? false : true,
})

await Document("improved_readme", {
  path: join(cwd(), "alchemy_test", "test.md"),
  prompt: await alchemy`
    You are a technical writer writing API documentation for Liminal.

    See ${alchemy.file("./README.md")} to understand the overview of Liminal.

    Then, write concise, clear, and comprehensive documentation for the following action.
  `,
})
