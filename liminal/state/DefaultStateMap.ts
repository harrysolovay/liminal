import { MessageRegistry } from "./MessageRegistry.ts"
import { ModelConfig } from "./ModelConfiguration.ts"
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
