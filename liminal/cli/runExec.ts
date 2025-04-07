import { dirname, isAbsolute, parse, resolve } from "node:path"
import { parseArgs, type ParseArgsConfig } from "node:util"
import { type Actor, Exec, L, type LEvent, type LiminalConfig } from "../index.ts"
import type { CliCtx } from "./cli_common.ts"
import { WriteHandler } from "./WriteHandler.ts"

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
} satisfies ParseArgsConfig["options"]

export async function runExec(ctx: CliCtx, args: Array<string>) {
  let {
    values: {
      config: configPath,
      execId,
    },
    positionals,
  } = parseArgs({
    args,
    strict: true,
    allowPositionals: true,
    options,
  })
  const configPathResolved = resolve(configPath)
  const configDir = dirname(configPathResolved)
  const config = await import(configPathResolved).then(({ default: default_ }) => default_ as LiminalConfig)
  const actorPathInitial = L.string.assert(positionals[0])
  let actorPathResolved: string
  if (isAbsolute(actorPathInitial)) {
    actorPathResolved = actorPathInitial
  } else {
    actorPathResolved = resolve(configDir, ...config.actors ? [config.actors] : [], actorPathInitial)
  }
  if (!actorPathResolved.endsWith(".ts")) {
    actorPathResolved = `${actorPathResolved}.ts`
  }
  const parsedPath = parse(actorPathResolved)
  const actorLike = await import(actorPathResolved).then(({ default: default_ }) => default_ as () => Actor)
  const startTime = Date.now()
  const writeHandlerOrNoop = config.write
    ? await WriteHandler({
      configDir,
      parsedPath,
      execId,
      startTime,
      stateDir: typeof config.write === "string" ? config.write : ".liminal",
    })
    : undefined
  const printHandlerOrNoop = config.silent ? undefined : (event: LEvent) => console.log(event)
  const exec = Exec(actorLike, {
    default: config.default,
    args: config.args!,
  })
  await exec((event) => {
    printHandlerOrNoop?.(event)
    writeHandlerOrNoop?.(event)
  }, {
    signal: ctx.ctl.signal,
  })
}
