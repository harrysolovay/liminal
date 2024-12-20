import { assert } from "@std/assert"
import type { PartialType } from "../Type.ts"
import { TypeVisitor } from "../TypeVisitor.ts"
import { matchUnionMember } from "./assert.ts"

export function deserialize<T>(this: PartialType, jsonText: string): T {
  return visit(JSON.parse(jsonText), this) as never
}

const visit = TypeVisitor<unknown, unknown>({
  hook(next, value, type) {
    return next(value, type)
  },
  array(value, _1, element): unknown {
    return (value as Array<unknown>).map((e) => visit(e, element))
  },
  object(value, _1, fields): unknown {
    return Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, visit((value as never)[k], v)]),
    )
  },
  union(value, _1, ...members): unknown {
    const matched = matchUnionMember(members, value)!
    assert(matched)
    return visit(value, matched)
  },
  ref(ctx, _1, get): unknown {
    return visit(ctx, get())
  },
  transform(ctx, _1, from, f): unknown {
    return f(visit(ctx, from))
  },
  fallback(value) {
    return value
  },
})