export type JSONValue = null | boolean | number | string | JSONValueArray | JSONValueObject

export type JSONValueArray = Array<JSONValue>

export type JSONValueObject = { [key: string]: JSONValue }
