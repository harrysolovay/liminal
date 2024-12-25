import * as A from "@std/assert"
import { testIntrinsics } from "testing"
import * as I from "../intrinsics.ts"
import type { AnyType } from "../Type.ts"

testIntrinsics<[AnyType, unknown, errorCount?: number]>("assert", assertErrors, {
  null: [
    [I.null, null],
    [I.null, undefined, 1],
  ],
  boolean: [
    [I.boolean, true],
    [I.boolean, 20, 1],
  ],
  integer: [
    [I.integer, 1],
    [I.integer, 1.1, 1],
  ],
  number: [
    [I.number, 1],
    [I.number, 1.1],
    [I.number, "0", 1],
  ],
  string: [
    [I.string, "A"],
    [I.string, 1, 1],
  ],
  const: [
    [I.const(I.string, "A"), "A"],
    [I.const(I.string, "A"), "B", 1],
  ],
  enum: [
    [I.enum("A", "B"), "A"],
    [I.enum("A", "B"), "C", 1],
  ],
  array: [
    [I.array(I.number), [1, 2, 3]],
    [I.array(I.number), ["one", "two", "three"], 3],
  ],
  object: [
    [I.object({ a: I.string, b: I.number }), { a: "A", b: 2 }],
    [I.object({ a: I.string, b: I.number }), { a: "A" }, 1],
    [I.object({ a: I.string, b: I.number }), { a: "A", b: 2, c: true }, 1],
  ],
})

async function assertErrors(
  _t: Deno.TestContext,
  type: AnyType,
  value: unknown,
  errorCount?: number,
): Promise<void> {
  try {
    await type.assert(value)
  } catch (exception: unknown) {
    A.assertInstanceOf(exception, AggregateError)
    A.assertEquals(exception.errors.length, errorCount ?? 0)
  }
}
