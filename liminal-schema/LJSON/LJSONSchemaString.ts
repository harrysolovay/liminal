export interface LJSONSchemaString<T = any> {
  T: T
  type: "string"
  enum?: Array<string>
  const?: string
}
