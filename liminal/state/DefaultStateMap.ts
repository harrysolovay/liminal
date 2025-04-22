import { MessageRegistry } from "./MessageRegistry.ts"
import { ModelConfig } from "./ModelConfig.ts"
import { ModelRegistry } from "./ModelRegistry.ts"
import { StateMap } from "./StateMap.ts"

export class DefaultStateMap extends StateMap {
  constructor() {
    super([
      [ModelRegistry, new ModelRegistry()],
      [MessageRegistry, new MessageRegistry()],
      [ModelConfig, new ModelConfig()],
    ])
  }
}
