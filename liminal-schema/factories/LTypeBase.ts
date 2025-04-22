export interface LTypeBase<T> {
  T: T
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...values: Array<string>): this
}
