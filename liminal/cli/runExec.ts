import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"
import { parseArgs, type ParseArgsConfig } from "node:util"
import { type ActorLike, exec, L, type LEvent, type LiminalConfig } from "../index.ts"
import { assert } from "../util/assert.ts"
import { createWriteHandler } from "./createWriteHandler.ts"

const options = {
  config: {
    type: "string",
    default: "liminal.ts",
    short: "c",
  },
  execId: {
    type: "string",
    short: "i",
  },
  stateDir: {
    type: "string",
    default: ".liminal",
    short: "o",
  },
  write: {
    type: "boolean",
    default: false,
    short: "w",
  },
} satisfies ParseArgsConfig["options"]

export async function runExec(args: Array<string>) {
  const {
    values: {
      config: configPath,
      stateDir,
      write,
      execId,
    },
    positionals,
  } = parseArgs({
    args,
    strict: true,
    allowPositionals: true,
    options,
  })
  const config = await import(resolve(configPath)).then(({ default: default_ }) => default_ as LiminalConfig)
  const actorPath = L.string.assert(positionals[0])
  const actorLike = await import(resolve(config.actors ?? "", actorPath)).then(({ default: default_ }) =>
    default_ as ActorLike
  )

  let writeHandlerOrNoop = write ? createWriteHandler(stateDir, execId) : undefined
  let printHandlerOrNoop = config.print ? (event: LEvent) => console.log(event) : undefined

  await exec(actorLike, {
    default: config.default,
    args: config.args,
    handler: (event) => {
      config.handler?.(event)
      printHandlerOrNoop?.(event)
      writeHandlerOrNoop?.(event)
    },
  })
}
