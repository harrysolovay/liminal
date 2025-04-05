#!/usr/bin/env node

import { argv } from "node:process"
import { L } from "../index.ts"
import { runExec } from "./runExec.ts"

const args = argv.slice(2)
const command = L.enum("exec").assert(args.shift())
switch (command) {
  case "exec": {
    await runExec(args)
    break
  }
}
