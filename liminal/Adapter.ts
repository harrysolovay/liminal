import type { ProviderReducers } from "./StateReducers/StateReducers.js"

export function Adapter<Model, Message>(providerReducers: ProviderReducers<Model, Message>): Adapter<Model, Message> {
  return { providerReducers }
}

export interface Adapter<Model, Message> {
  providerReducers: ProviderReducers<Model, Message>
}
