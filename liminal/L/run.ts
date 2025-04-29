import { Context, type ContextConfig } from "../Context.ts"
import type { Definition } from "../Definition.ts"
import type { Rune } from "../Rune.ts"
import { Strand } from "../Strand.ts"

export function run<Y extends Rune<any>, T>(
  definition: Definition<Y, T>,
  config?: ContextConfig<Y>,
): Strand {
  return new Strand(definition, {
    ...config && {
      context: new Context(config),
    },
  })
}
