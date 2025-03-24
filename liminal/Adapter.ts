import type { ProviderReducers } from "./ActionReducers/ActionReducers.js"

export function Adapter<Model, Message>(providerReducers: ProviderReducers<Model, Message>): Adapter<Model, Message> {
  return { providerReducers }
}

export interface Adapter<Model, Message> {
  providerReducers: ProviderReducers<Model, Message>
}
