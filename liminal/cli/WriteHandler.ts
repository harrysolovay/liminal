import { mkdir, writeFile } from "node:fs/promises"
import { type ParsedPath, relative, resolve } from "node:path"
import type { LEvent } from "../events/LEvent.ts"
import type { EventScope } from "../EventScope.ts"

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
}): Promise<(event: EventScope) => Promise<void>> {
  const destDir = resolve(stateDir, relative(configDir, parsedPath.dir), parsedPath.name, startTime.toString())
  try {
    await mkdir(destDir, { recursive: true })
  } catch (_e: unknown) {}
  let i = 0
  return async (_event: LEvent) => {
    // const key = `${i++}${eventPath(event)}.json`
    // const destPath = resolve(destDir, key)
    // await writeFile(destPath, JSON.stringify(event, null, 2), "utf-8")
  }
}

// function eventPath(event: LEvent) {
//   let path = ""
//   let current = event
//   while (current.type === "propagated") {
//     path += `__${current.scopeType}_${current.scope}`
//     current = current.event
//   }
//   path += `__${current.type}`
//   return path
// }
