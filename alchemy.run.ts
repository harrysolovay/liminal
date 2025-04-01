import alchemy from "alchemy"
import { argv } from "node:process"
import { LiminalExec } from "./packages/alchemy/index.ts"

const app = alchemy("github:liminal", {
  phase: argv.includes("--destroy") ? "destroy" : "up",
  quiet: argv.includes("--verbose"),
})

await LiminalExec("documentation", {
  main: "",
})

await app.finalize()
