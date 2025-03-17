export declare function system(...values: Array<string>): Generator<Message, () => void>
export declare function system(template: TemplateStringsArray, ...values: Array<string>): Generator<Message, () => void>

export type Message = {
  type: "system"
  value: string
}
