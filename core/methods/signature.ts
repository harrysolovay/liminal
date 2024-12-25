import { WeakMemo } from "../../util/WeakMemo.ts"
import type { AnyType } from "../Type.ts"
import { TypeVisitor } from "../TypeVisitor.ts"

export function signature(this: AnyType): string {
  return signatureMemo.getOrInit(this)
}

const signatureMemo: WeakMemo<AnyType, string> = new WeakMemo((type) => {
  const ctx = new SignatureContext()
  visit(ctx, type)
  return `{\n  ${Object.entries(ctx.defs).map(([k, v]) => `${k}: ${v}`).join("\n  ")}\n}`
})

class SignatureContext {
  ids: Map<AnyType, string> = new Map()
  defs: Record<string, undefined | string> = {}
}

const visit = TypeVisitor<SignatureContext, string>({
  hook(next, ctx, type): string {
    const { ids, defs } = ctx
    switch (type.type) {
      case "array":
      case "object":
      case "union": {
        let id = ids.get(type)
        if (id === undefined) {
          id = ids.size.toString()
          ids.set(type, id)
        }
        if (id in defs) {
          return `i(${id})`
        }
        defs[id] = undefined
        const signature = next(ctx, type)
        defs[id] = signature
        return `i(${id})`
      }
    }
    return next(ctx, type)
  },
  const(_0, _1, _2, value): string {
    if (typeof value === "string") {
      return `"${escapeDoubleQuotes(value)}"`
    }
    return JSON.stringify(value)
  },
  array(ctx, _1, element): string {
    return `array(${visit(ctx, element)})`
  },
  object(ctx, _1, fields): string {
    return `object({ ${
      Object
        .entries(fields)
        .map(([k, v]) => `${escapeDoubleQuotes(k)}: ${visit(ctx, v)}`)
        .join(", ")
    } })`
  },
  enum(_0, _1, ...values) {
    return `enum("${values.map(escapeDoubleQuotes).join(`", "`)}")`
  },
  union(ctx, _1, ...members): string {
    return `union(${members.map((member) => visit(ctx, member)).join(", ")})`
  },
  f(ctx, _1, get): string {
    return visit(ctx, get())
  },
  transform(ctx, _1, from): string {
    return visit(ctx, from)
  },
  fallback(_0, type) {
    return type.type
  },
})

function escapeDoubleQuotes(value: string): string {
  return value.indexOf(`"`) !== -1 ? JSON.stringify(value) : value
}
