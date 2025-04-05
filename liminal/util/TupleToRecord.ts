export type TupleToRecord<T extends Array<any>> = [
  {
    [K in keyof T as K extends `${number}` ? K : never]: T[K]
  },
][0]
