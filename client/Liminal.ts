import type { Adapter, AdapterDescriptor } from "./Adapter.ts"
import { Session } from "./Session.ts"

export class Liminal<D extends AdapterDescriptor> {
  constructor(readonly adapter: Adapter<D>) {}

  session = (history?: Array<D["message"]>): Session<D> => new Session(this, history)
}