import { scope } from "../scope.ts"

export const tools = {
  *[Symbol.iterator]() {
    const scope_ = yield* scope
    return scope_.tools
  },
}

export const signal = {
  *[Symbol.iterator]() {
    const scope_ = yield* scope
    return scope_.controller.signal
  },
}

export const messages = {
  *[Symbol.iterator]() {
    const scope_ = yield* scope
    return scope_.messages
  },
}
