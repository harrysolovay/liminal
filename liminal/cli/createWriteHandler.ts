import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"
import type { LEvent } from "../events/LEvent.ts"
import { assert } from "../util/assert.ts"

export function createWriteHandler(stateDir: string, execId: string | undefined): (event: LEvent) => Promise<void> {
  const rootScopeDir = resolve(stateDir, `${Date.now().toString()}${execId ? `_${execId}` : ""}`)
  return async function write(event: LEvent, parentDir = rootScopeDir) {
    let scopeCount = 0
    let scopes: Record<string, Promise<string>> = {}
    switch (event.type) {
      case "event_propagated": {
        const { scope } = event
        assert(typeof scope === "string")
        let scopeDirPending: Promise<string>
        if (!(scope in scopes)) {
          scopeDirPending = (async () => {
            const scopeDir = `${scopeCount}_${scope}`
            await mkdir(parentDir, { recursive: true })
            return scopeDir
          })()
          scopes[scope] = scopeDirPending
          scopeCount += 1
        } else {
          scopeDirPending = scopes[scope]!
        }
        scopeDirPending.then((resolved) => write(event.event, resolved))
      }
    }
  }
}
