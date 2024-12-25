import type { AnyType } from "../Type.ts"
import type { DescriptionParamValue } from "./DescriptionParam.ts"
import type { AnyParam } from "./Param.ts"

export interface Template {
  node: "Template"
  template: TemplateStringsArray
  parts: Array<TemplatePart>
}

export type TemplatePart =
  | number
  | string
  | AnyType
  | AnyParam<number | string | DescriptionParamValue>
