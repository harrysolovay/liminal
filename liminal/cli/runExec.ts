import { dirname, isAbsolute, parse, resolve } from "node:path"
import { parseArgs, type ParseArgsConfig } from "node:util"
import { type Agent, type EventResolved, exec, L, type LiminalConfig } from "../index.ts"
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
  const agentPathInitial = L.string.assert(positionals[0])
  let agentPathResolved: string
  if (isAbsolute(agentPathInitial)) {
    agentPathResolved = agentPathInitial
  } else {
    agentPathResolved = resolve(configDir, ...config.agents ? [config.agents] : [], agentPathInitial)
  }
  if (!agentPathResolved.endsWith(".ts")) {
    agentPathResolved = `${agentPathResolved}.ts`
  }
  const parsedPath = parse(agentPathResolved)
  let agentLike: () => Agent
  try {
    agentLike = await import(agentPathResolved).then(({ default: default_ }) => default_ as () => Agent)
  } catch (_e: unknown) {
    ctx.error(`Could not fine agent file at "${agentPathResolved}".`)
  }
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
  const printHandlerOrNoop = config.silent ? undefined : (event: EventResolved) => console.log(event)
  await exec(agentLike, {
    default: config.default,
    args: config.args!,
    handler(event) {
      printHandlerOrNoop?.(event)
      writeHandlerOrNoop?.(event)
    },
    signal: ctx.ctl.signal,
  })
}
