export type JsonValue = null | boolean | number | string | JsonValueArray | JsonValueObject

export type JsonValueArray = Array<JsonValue> | ReadonlyArray<JsonValue>

export type JsonValueObject = { [key: string]: JsonValue }
