export declare function system(
  template: TemplateStringsArray,
  ...values: Array<unknown>
): Generator<Message, () => void>

export type Message = {
  type: "system"
  value: string
}
