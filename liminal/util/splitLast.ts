export function splitLast(value: string, search: string): undefined | [string, string] {
  const lastI = value.lastIndexOf(search)
  if (lastI === -1) {
    return undefined
  }
  return [value.slice(0, lastI), value.slice(lastI + search.length)]
}
