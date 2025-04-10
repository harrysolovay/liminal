import { getScope } from "../getScope.ts"

export function* tools() {
  const scope = yield* getScope()
  return scope.tools
}

export function* signal() {
  const scope = yield* getScope()
  return scope.controller.signal
}

export function* messages() {
  const scope = yield* getScope()
  return scope.messages
}
