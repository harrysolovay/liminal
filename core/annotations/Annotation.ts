import type { Falsy } from "@std/assert"
import type { AnyType } from "../Type.ts"
import type { Assertion } from "./Assertion.ts"
import type { Arg, Param } from "./Param.ts"
import type { Template } from "./Template.ts"

export type Annotation<T = any> =
  | Falsy
  | number
  | string
  | Template
  | AnyType
  | Assertion<T>
  | Param
  | Arg
