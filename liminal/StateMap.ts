export class StateMap extends Map<StateConstructor, any> {}

export type StateConstructor = new() => any

export type StateEntries = Array<[StateConstructor, any]>
