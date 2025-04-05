import { resolve } from "node:path"
import { parseArgs, type ParseArgsConfig } from "node:util"
import { type ActorLike, exec, L, type LiminalConfig } from "../index.ts"

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
} satisfies ParseArgsConfig["options"]

export async function runExec(args: Array<string>) {
  const { values: { config: configPath }, positionals } = parseArgs({
    args,
    strict: true,
    allowPositionals: true,
    options,
  })
  const config = await import(resolve(configPath)).then(({ default: default_ }) => default_ as LiminalConfig)
  if (config.print) {
    const { handler } = config
    config.handler = (event) => {
      // TODO:
      console.log(event)
      handler?.(event)
    }
  }
  const actorPath = L.string.assert(positionals[0])
  const actorLike = await import(resolve(config.actors ?? "", actorPath)).then(({ default: default_ }) =>
    default_ as ActorLike
  )
  config.handler?.({ type: "entered" })
  const scope = await exec(actorLike, {
    bind: config.bind,
    handler: (event) => {
      config.handler?.({
        type: "event_propagated",
        scopeType: "module",
        scope: actorPath,
        event,
      })
    },
  })
  const { value: result } = scope
  config.handler?.({
    type: "exited",
    value: result,
  })
}
