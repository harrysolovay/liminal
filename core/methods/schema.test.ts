import { assert, assertEquals } from "@std/assert"
import { assertSnapshot } from "@std/testing/snapshot"
import type { AssertTrue, IsExact, IsNever } from "conditional-type-checks"
import { testIntrinsics } from "testing"
import * as L from "../L.ts"
import type { Type } from "../Type.ts"

testIntrinsics("toJSON", assertTypeSnapshot, {
  null: [
    [L.null],
  ],
  const: [
    [L.const(L.string, "Hello Liminal!")],
  ],
  boolean: [
    [L.boolean],
  ],
  number: [
    [L.number],
  ],
  integer: [
    [L.integer],
  ],
  string: [
    [L.string],
  ],
  array: [
    [L.array(L.string)],
  ],
  object: [
    [
      L.object({
        a: L.boolean,
        b: L.number,
        c: L.string,
      }),
    ],
  ],
  enum: [
    [L.enum("A", "B", "C")],
  ],
  union: [
    [L.union(L.null, L.string)],
  ],
  f: [
    [L.f(() => L.string)],
  ],
  transform: [
    [L.transform(L.string, (value) => ({ value }))],
  ],
})

async function assertTypeSnapshot(t: Deno.TestContext, type: Type<unknown>): Promise<void> {
  await assertSnapshot(t, type.schema())
  const withContext = type`One.`
  await assertSnapshot(t, withContext.schema())
  await assertSnapshot(t, withContext`Two.`.schema())
}

Deno.test("toJSON Descriptions", async (t) => {
  await t.step("Params", () => {
    const P_ = Symbol()
    const P = L.DescriptionParam(P_)
    const E = L.string`P: ${P}`
    type _0 = AssertTrue<IsExact<typeof E["D"], typeof P_>>
    const R = L.array(E)`Root.`
    type _1 = AssertTrue<IsExact<typeof R["D"], typeof P_>>
    const RR = R(P("V"))
    type _2 = AssertTrue<IsNever<typeof RR["D"]>>
    const json0 = RR.schema()
    assertEquals(json0.description, "Root.")
    assert("items" in json0)
    assertEquals(json0.items.description, "P: V")
    const RRR = RR`Another: ${P}.`
    type _3 = AssertTrue<IsExact<typeof RRR["D"], typeof P_>>
    const RRRR = RRR(P("X"))
    type _4 = AssertTrue<IsNever<typeof RRRR["D"]>>
    const json1 = RRRR.schema()
    assertEquals(json1.description, "Another: X. Root.")
    assert("items" in json1)
    assertEquals(json1.items.description, "P: V")
    const RRRRR = RRRR(P("Unused"))
    type _5 = AssertTrue<IsNever<typeof RRRRR["D"]>>
    const json2 = RRRRR.schema()
    assertEquals(json2.description, "Another: X. Root.")
    assert("items" in json2)
    assertEquals(json2.items.description, "P: V")
  })
})
