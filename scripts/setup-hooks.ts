import { rootDir } from "./files.mjs"

console.log("Setting up hooks...")

const typecheck = confirm("Include typecheck (bun run build)?")
const tests = confirm("Include tests (bun test)?")

const precommitFile = rootDir(".githooks/pre-commit")
await Bun.file(precommitFile).write(`#!/bin/sh
set -e
bun "$(dirname "$0")/pre-commit.ts"${tests ? " --test" : ""}${typecheck ? " --build" : ""}
`)
// Make the pre-commit hook executable
await Bun.$`chmod +x ${precommitFile}`

console.log(`Created pre-commit hook at ${precommitFile}`)

await Bun.$`git config core.hooksPath ${rootDir(".githooks")}`
console.log("Setup git config core.hooksPath")
