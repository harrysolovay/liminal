import { assert } from "@std/assert"
import type { AssertTrue, IsNever } from "conditional-type-checks"
import { recombine } from "../../util/mod.ts"
import type { AnyType } from "../Type.ts"
import type { Assertion } from "./Assertion.ts"
import { DescriptionParamKey, isDescriptionParamValue } from "./DescriptionParam.ts"

export class AnnotationContext {
  constructor(
    readonly type: AnyType,
    readonly descriptions: Array<string> = [],
    readonly pins: Map<AnyType, string> = new Map(),
    readonly args: Record<symbol, Array<unknown>> = {},
    readonly assertions: Array<Assertion> = [],
  ) {
    type.annotations.toReversed().forEach((annotation) => {
      if (typeof annotation === "string") {
        descriptions.push(annotation)
      } else if (typeof annotation === "number") {
        descriptions.push(annotation.toString())
      } else if (annotation) {
        switch (annotation.node) {
          case "Template": {
            descriptions.push(recombine(
              annotation.template,
              annotation.parts.map((part) => {
                if (typeof part === "string" || typeof part === "number") {
                  return part
                } else if (part.node === "Type") {
                  return this.pin(part)
                } else if (part.node === "Param") {
                  const values = args[part.key]
                  assert(values && values.length)
                  const eL = values[values.length - 1]!
                  if (isDescriptionParamValue(eL)) {
                    return eL[DescriptionParamKey]
                  }
                  assert(typeof values === "string")
                  return values
                }
                type _ = AssertTrue<IsNever<typeof part>>
              }),
            ))
            break
          }
          case "Type": {
            descriptions.push(this.pin(annotation))
            break
          }
          case "Assertion": {
            assertions.push(annotation)
            break
          }
          case "Param": {
            const values = args[annotation.key]
            assert(values && values.length)
            const eL = values[values.length - 1]!
            if (isDescriptionParamValue(eL)) {
              this.descriptions.push(eL[DescriptionParamKey])
            }
            break
          }
          case "Arg": {
            let values = args[annotation.key]
            if (!values) {
              values = []
              args[annotation.key] = values
            }
            values.push(annotation.value)
            break
          }
          default: {
            type _ = AssertTrue<IsNever<typeof annotation>>
          }
        }
      }
    })
  }

  pin = (type: AnyType): string => {
    let pin = this.pins.get(type)
    if (!pin) {
      pin = `T${this.pins.size}`
      this.pins.set(type, pin)
    }
    return pin
  }

  child = (type: AnyType): AnnotationContext =>
    new AnnotationContext(type, [], this.pins, { ...this.args }, [])

  format = (declarePins?: boolean): string | undefined => {
    if (declarePins && this.pins.size) {
      const pinSegments: Array<string> = [
        `The following description makes references to type${this.pins.size > 1 ? "s" : ""} ${
          [...this.pins.values()].join(", ")
        } where:\n`,
      ]
      for (const [type, pinId] of this.pins.entries()) {
        pinSegments.push(`  ${pinId}:\n    ${type.display(2)}`)
      }
      this.descriptions.unshift(...pinSegments)
    }
    if (this.assertions.length) {
      this.descriptions.push(
        `\n\nEnsure the following requirement${
          this.assertions.length > 1 ? "s are" : " is"
        } met:\n\n- `,
        this.assertionDescriptions().join("\n- "),
      )
    }
    return this.descriptions.length ? this.descriptions.join(" ") : undefined
  }

  assertionDescriptions = (): Array<string> => this.assertions.map(({ description }) => description)
}
