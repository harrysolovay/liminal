export function isPropertyKey(value: unknown): value is number | string | symbol {
  return typeof value === "number" || typeof value === "string" || typeof value === "symbol"
}
