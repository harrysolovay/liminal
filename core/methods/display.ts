import type { AnyType } from "../Type.ts"
import { TypeVisitor } from "../TypeVisitor.ts"

export function display(this: AnyType, depth: number = 0): string {
  return visit(new DisplayContext(this, false, depth), this)
}

class DisplayContext {
  constructor(
    readonly rootType: AnyType,
    readonly visitedRoot: boolean,
    readonly depth: number,
  ) {}

  indentCtx = () => new DisplayContext(this.rootType, this.visitedRoot, this.depth + 1)
}

const visit = TypeVisitor<DisplayContext, string>({
  hook(next, ctx, type): string {
    if (type === ctx.rootType && ctx.visitedRoot) {
      return "self"
    }
    return next(new DisplayContext(ctx.rootType, true, ctx.depth), type)
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
    return `object({\n${
      Object
        .entries(fields)
        .map(([k, v]) =>
          `${"  ".repeat(ctx.depth + 1)}${escapeDoubleQuotes(k)}: ${visit(ctx.indentCtx(), v)}`
        )
        .join(",\n")
    }\n${"  ".repeat(ctx.depth)}})`
  },
  enum(_0, _1, ...values) {
    return `enum("${values.map(escapeDoubleQuotes).join(`", "`)}")`
  },
  union(ctx, _1, ...members): string {
    return `union(\n${"  ".repeat(ctx.depth + 1)}${
      members.map((member) => visit(ctx.indentCtx(), member)).join(
        `,\n${"  ".repeat(ctx.depth + 1)}`,
      )
    }\n)`
  },
  f(ctx, _1, get): string {
    return visit(ctx, get())
  },
  transform(ctx, _1, from): string {
    return `f(${visit(ctx, from)})`
  },
  fallback(_0, type) {
    return type.type
  },
})

function escapeDoubleQuotes(value: string): string {
  return value.indexOf(`"`) !== -1 ? JSON.stringify(value) : value
}
