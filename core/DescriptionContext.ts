import { recombine } from "../util/mod.ts"
import { DescriptionParamKey } from "./annotations/mod.ts"
import type { PartialType } from "./mod.ts"
import type { Type } from "./Type.ts"

export function description(type: Type<unknown>): string | undefined {
  return new DescriptionContext(new Map(), {}).format(type)
}

export class DescriptionContext {
  constructor(
    readonly pins: Map<PartialType, string> = new Map(),
    readonly args: Record<keyof any, unknown> = {},
  ) {}

  pin = (type: PartialType): string => {
    let pin = this.pins.get(type)
    if (!pin) {
      pin = this.pins.size.toString()
      this.pins.set(type, pin)
    }
    return pin
  }

  format = (type: Type<unknown>): undefined | string => {
    const assertionDescriptions: Array<string> = []
    let segments: Array<number | string> = []
    type.annotations.forEach((annotation) => {
      if (annotation) {
        if (typeof annotation === "number" || typeof annotation === "string") {
          segments.push(annotation)
        } else {
          switch (annotation.type) {
            case "Template": {
              segments.push(recombine(
                annotation.template,
                annotation.parts.map((part) => {
                  if (typeof part === "number" || typeof part === "string") {
                    return part
                  }
                  switch (part.type) {
                    case "Param": {
                      return this.args[part.key]
                    }
                    case "Type": {
                      return this.pin(part)
                    }
                  }
                }),
              ))
              break
            }
            case "Type": {
              segments.push(this.pin(annotation))
              break
            }
            case "Param": {
              const arg = this.args[annotation.key]
              if (typeof arg === "string") {
                segments.push(arg)
              } else if (typeof arg === "object" && arg !== null && DescriptionParamKey in arg) {
                segments.push(arg[DescriptionParamKey] as string)
              }
              break
            }
            case "Arg": {
              this.args[annotation.key] = annotation.value
              break
            }
            case "Assertion": {
              assertionDescriptions.push(annotation.description)
              break
            }
          }
        }
      }
    })
    segments = [
      ...segments,
      ...assertionDescriptions.length
        ? [
          "\n\nEnsure:\n\n",
          ...assertionDescriptions.map((d) => `- ${d}`).join("\n"),
        ]
        : [],
    ]
    return segments.length ? segments.join(" ") : undefined
  }
}
