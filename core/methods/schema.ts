import { AnnotationContext } from "../annotations/mod.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { AnyType, Type } from "../Type.ts"
import { TypeVisitor } from "../TypeVisitor.ts"

export function schema(this: Type<unknown, any>): JSONType {
  const ctx = new ToJSONContext(new Map(), {})
  const root = visit([ctx, new AnnotationContext(this)], this)
  const { "0": _root, ...$defs } = ctx.defs
  return { ...root, ...Object.keys($defs).length ? { $defs } : {} } as never
}

class ToJSONContext {
  constructor(
    readonly ids: Map<AnyType, string>,
    readonly defs: Record<string, undefined | JSONType>,
  ) {}

  id(type: AnyType): string {
    let id = this.ids.get(type)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(type, id)
    }
    return id
  }
}

const visit = TypeVisitor<[ToJSONContext, AnnotationContext, root?: boolean], JSONType>({
  hook(next, [toJSONCtx, annotationCtx, root], type) {
    let jsonType: JSONType
    annotationCtx = annotationCtx.child(type)
    if (["array", "object", "union"].includes(type.type)) {
      const id = toJSONCtx.id(type)
      if (id in toJSONCtx.defs) {
        return toJSONCtx.defs[id] ?? {
          $ref: id === "0" ? "#" : `#/$defs/${id}`,
        }
      } else {
        toJSONCtx.defs[id] = undefined
        jsonType = next([toJSONCtx, annotationCtx], type)
        toJSONCtx.defs[id] = jsonType
      }
    } else {
      jsonType = next([toJSONCtx, annotationCtx], type)
    }
    return { description: annotationCtx.format(root), ...jsonType }
  },
  null() {
    return { type: "null" }
  },
  boolean() {
    return { type: "boolean" }
  },
  integer() {
    return { type: "integer" }
  },
  number() {
    return { type: "number" }
  },
  string() {
    return { type: "string" }
  },
  const(ctx, _1, valueType, value): JSONType {
    return {
      ...visit(ctx, valueType),
      const: value,
    }
  },
  array(ctx, _1, element): JSONType {
    return {
      type: "array",
      items: visit(ctx, element),
    }
  },
  object(ctx, _1, fields): JSONType {
    const required = Object.keys(fields)
    return {
      type: "object",
      properties: Object.fromEntries(required.map((k) => [k, visit(ctx, fields[k]!)])),
      required,
      additionalProperties: false,
    }
  },
  enum(_0, _1, ...values) {
    return {
      type: "string",
      enum: values,
    }
  },
  union(ctx, _1, ...members): JSONType {
    return {
      anyOf: members.map((member) => visit(ctx, member)),
    }
  },
  f(ctx, _1, get): JSONType {
    return visit(ctx, get())
  },
  transform(ctx, _1, from): JSONType {
    return visit(ctx, from)
  },
})
