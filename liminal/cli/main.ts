#!/usr/bin/env node

import process from "node:process"
import { L } from "../index.ts"
import type { CliCtx } from "./cli_common.ts"
import { runExec } from "./runExec.ts"

const args = process.argv.slice(2)
const command = L.enum("exec").assert(args.shift())
const ctl = new AbortController()

const cliCtx: CliCtx = {
  ctl,
  error(message) { // TODO
    throw new Error(message)
  },
}

switch (command) {
  case "exec": {
    await runExec(cliCtx, args)
    break
  }
}
