export class Globals<E = any> {
  static make(globals?: Globals): Globals {
    return new Globals(globals?.handler ?? (() => {}))
  }

  constructor(readonly handler?: (event: E, fiberInfo: FiberInfo) => void) {}
}

export interface FiberInfo {
  fiber: number
  timestamp: number
}
