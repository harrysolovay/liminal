export function splitLast(target: string, needle: string): undefined | [string, string] {
  const i = target.lastIndexOf(needle)
  if (i === -1) {
    return undefined
  }
  return [target.slice(0, i), target.slice(i + needle.length)]
}
