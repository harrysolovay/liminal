export class Fiber {
  static fiberCount = 0

  static make(): Fiber {
    return new Fiber()
  }

  readonly index: number = Fiber.fiberCount++
  readonly controller: AbortController = new AbortController()
  readonly signal: AbortSignal = this.controller.signal

  constructor(readonly parent?: Fiber) {}
}
