import { mkdir, writeFile } from "node:fs/promises"
import { type ParsedPath, relative, resolve } from "node:path"
import type { ResolvedEvent } from "../events/ResolvedEvent.ts"

export async function WriteHandler({
  stateDir,
  parsedPath,
  configDir,
  startTime,
}: {
  stateDir: string
  execId: string | undefined
  parsedPath: ParsedPath
  startTime: number
  configDir: string
}): Promise<(event: ResolvedEvent) => Promise<void>> {
  const destDir = resolve(stateDir, relative(configDir, parsedPath.dir), parsedPath.name, startTime.toString())
  let ensureDir: undefined | PromiseWithResolvers<void>
  let i = 0
  return async (event) => {
    if (!ensureDir) {
      ensureDir = Promise.withResolvers()
      ;(async () => {
        try {
          await mkdir(destDir, { recursive: true })
        } catch (_e: unknown) {}
        ensureDir.resolve()
      })()
    }
    await ensureDir.promise
    const key = `${i++}__${event.scope.join("__")}__${event.type}.json`
    const destPath = resolve(destDir, key)
    await writeFile(destPath, JSON.stringify(event, null, 2), "utf-8")
  }
}
