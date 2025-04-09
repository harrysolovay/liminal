import { fromMetatypeRootDescriptor } from "../../types/Metatype/fromMetatypeDescriptor.ts"
import { MetatypeRootDescriptor } from "../../types/Metatype/MetatypeDescriptor.ts"
import type { Falsy } from "../../util/Falsy.ts"
import type { TaggableArgs } from "../../util/Taggable.ts"

export function* metatype(...args: TaggableArgs<[...description: Array<string | Falsy>]>) {
  const descriptor = yield* MetatypeRootDescriptor(args.map((e) => typeof e === "string").join("\n"))
  return fromMetatypeRootDescriptor(descriptor)
}
