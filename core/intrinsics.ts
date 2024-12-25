import { isTemplateStringsArray } from "../util/mod.ts"
import type { Annotation, TemplatePart } from "./annotations/mod.ts"
import {
  assert,
  description,
  deserialize,
  display,
  extract,
  inspect,
  schema,
  signature,
} from "./methods/mod.ts"
import type { ReduceDependencies } from "./ReduceDependencies.ts"
import type { AnyType, Type, TypeDeclaration } from "./Type.ts"

export { null_ as null }
const null_: Type<null> = declare({
  type: "null",
  self() {
    return null_
  },
})

export const boolean: Type<boolean> = declare({
  type: "boolean",
  self() {
    return boolean
  },
})

export const integer: Type<number> = declare({
  type: "integer",
  self() {
    return integer
  },
})

export const number: Type<number> = declare({
  type: "number",
  self() {
    return number
  },
})

export const string: Type<string> = declare({
  type: "string",
  self() {
    return string
  },
})

export { const_ as const }
function const_<T, P extends symbol, const A extends T>(
  type: Type<T, P>,
  value: A,
): Type<A, P> {
  return declare({
    type: "const",
    self() {
      return const_
    },
    args: [type, value],
  })
}
Object.defineProperty(const_, "name", { value: "const" })

export function array<T, P extends symbol>(element: Type<T, P>): Type<Array<T>, P> {
  return declare({
    type: "array",
    self() {
      return array
    },
    args: [element],
  })
}

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["D"]> {
  return declare({
    type: "object",
    self() {
      return object
    },
    args: [Object.fromEntries(Object.keys(fields).toSorted().map((key) => [key, fields[key]]))],
  })
}

export { enum_ as enum }
function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return declare({
    type: "enum",
    self() {
      return enum_
    },
    args: values.toSorted(),
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })

export function union<M extends Array<AnyType>>(
  ...members: M
): Type<M[number]["T"], M[number]["D"]> {
  return declare({
    type: "union",
    self() {
      return union
    },
    args: members,
  })
}

export function f<T, P extends symbol>(get: () => Type<T, P>): Type<T, P> {
  return declare({
    type: "f",
    self() {
      return f
    },
    args: [get],
  }) as never
}

export function transform<T, P extends symbol, R>(
  from: Type<T, P>,
  f: (value: T) => R,
): Type<R, P> {
  return declare({
    type: "transform",
    self() {
      return transform
    },
    args: [from, f],
  })
}

function declare<T, D extends symbol>(
  declaration: TypeDeclaration,
  annotations: Array<Annotation> = [],
): Type<T, D> {
  return Object.assign(
    Type,
    inspect,
    declaration,
    {
      node: "Type",
      trace: new Error().stack!,
      annotations,
      display,
      extract,
      description,
      signature,
      schema,
      deserialize,
      assert,
      is(value): value is T {
        try {
          assert.call(this as Type<T, D>, value)
          return true
        } catch (_e: unknown) {
          return false
        }
      },
    } satisfies Omit<Type<T, D>, keyof TypeDeclaration | "T" | "D"> as never,
  )

  function Type<A extends Array<TemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, ReduceDependencies<D, A>>
  function Type<A extends Array<Annotation>>(...annotations: A): Type<T, ReduceDependencies<D, A>>
  function Type(
    e0: Annotation | TemplateStringsArray,
    ...eRest: Array<Annotation>
  ): Type<T, symbol> {
    if (isTemplateStringsArray(e0)) {
      return declare(declaration, [...annotations, {
        node: "Template",
        template: e0,
        parts: eRest as Array<TemplatePart>,
      }])
    }
    return declare(declaration, [...annotations, e0, ...eRest])
  }
}
