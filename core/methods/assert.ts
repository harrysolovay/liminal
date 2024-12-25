import { assert as assert_, assertArrayIncludes, assertEquals } from "@std/assert"
import type { Diagnostic } from "../Diagnostic.ts"
import type { AnyType } from "../Type.ts"
import { TypeVisitor } from "../TypeVisitor.ts"

export function assert<T>(this: AnyType<T>, value: unknown): asserts value is T {
  const diagnostics: Array<Diagnostic> = []
  visit(new AssertContext(diagnostics, "root", value), this)
  if (diagnostics.length) {
    throw new AggregateError(diagnostics.map(({ exception }) => exception))
  }
}

export class AssertContext {
  constructor(
    readonly diagnostics: Array<Diagnostic>,
    readonly path: string,
    readonly value: unknown,
    readonly junction?: number | string,
  ) {}

  descend = (value: unknown, junction?: number | string): AssertContext =>
    new AssertContext(this.diagnostics, this.path, value, junction)
}

const visit = TypeVisitor<AssertContext, void>({
  hook(next, ctx, type) {
    const path = ctx.junction ? ctx.path : `${ctx.path}["${ctx.junction}"]`
    try {
      next(ctx, type)
    } catch (exception: unknown) {
      ctx.diagnostics.push({
        type,
        path,
        exception,
        value: ctx.value,
      })
    }
  },
  null({ value }) {
    assert_(value === null)
  },
  boolean({ value }) {
    assert_(typeof value === "boolean")
  },
  integer({ value }) {
    assert_(Number.isInteger(value))
  },
  number({ value }) {
    assert_(typeof value === "number")
  },
  string({ value }) {
    assert_(typeof value === "string")
  },
  const({ value }, _1, _2, cmpValue) {
    assertEquals(value, cmpValue)
  },
  enum({ value }, _1, ...values) {
    assert_(typeof value === "string")
    assertArrayIncludes(values, [value])
  },
  array(ctx, _1, element) {
    assert_(Array.isArray(ctx.value))
    ctx.value.forEach((value, i) => visit(ctx.descend(value, i), element))
  },
  object(ctx, _1, fields) {
    const keys = Object.keys(fields).toSorted()
    const { value } = ctx
    assert_(typeof value === "object" && value !== null)
    assertEquals(keys, Object.keys(value).toSorted())
    keys.forEach((key) => visit(ctx.descend(value[key as never], key), fields[key]!))
  },
  transform(ctx, _1, from) {
    visit(ctx, from)
  },
  union(ctx, _1, ...members) {
    const match = matchUnionMember(members, ctx.value)
    assert_(match)
    visit(ctx, match)
  },
  f(ctx, _1, get) {
    visit(ctx, get())
  },
})

export function matchUnionMember(members: Array<AnyType>, value: unknown): AnyType | void {
  const queue = [...members]
  while (queue.length) {
    const current = queue.pop()!
    const diagnostics: Array<Diagnostic> = []
    visit(new AssertContext(diagnostics, "", value), current)
    if (diagnostics.length) {
      continue
    }
    return current
  }
}
