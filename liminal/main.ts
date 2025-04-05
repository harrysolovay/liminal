#!/usr/bin/env node

import { resolve } from "node:path"
import { argv } from "node:process"
import { parseArgs } from "node:util"
import { type ActorLike, exec, L, type LiminalConfig } from "./index.ts"

const args = argv.slice(2)
const command = L.enum("exec").assert(args.shift())
switch (command) {
  case "exec": {
    const { values: { config: configPath }, positionals } = parseArgs({
      args,
      strict: true,
      allowPositionals: true,
      options: {
        config: {
          type: "string",
          default: "liminal.ts",
          short: "c",
        },
      },
    })
    const config = await import(resolve(configPath)).then(({ default: default_ }) => default_ as LiminalConfig)
    const actorPath = L.string.assert(positionals[0])
    const actorLike = await import(resolve(config.actorsDir ?? "", actorPath)).then(({ default: default_ }) =>
      default_ as ActorLike
    )
    await exec(actorLike, config.exec)
  }
}
